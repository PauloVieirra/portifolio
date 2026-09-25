// e2e/public.mjs — npm run build && npx vite preview (porta 4173) em outro terminal, depois: npm run e2e
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { createClient } from '@supabase/supabase-js';

process.loadEnvFile('.env');
const BASE = process.env.BASE_URL || 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const rows = async (table, filter) => { let q = db.from(table).select('*'); if (filter) q = q.eq(...filter); const { data, error } = await q; if (error) throw error; return data; };

const browser = await chromium.launch({ executablePath: CHROME });
const step = async (name, fn) => {
  try { await fn(); console.log('✓', name); } catch (e) { console.error('✗', name, '\n  ', e.message); process.exitCode = 1; }
};
const open = async (path, { block = false } = {}) => {
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  if (block) await page.route(/supabase\.co/, r => r.abort());
  await page.goto(`${BASE}/${path}`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  return { page, errors };
};

await step('home renderiza o conteúdo do Supabase', async () => {
  const { page, errors } = await open('index.html');
  const timeline = await rows('timeline'), site = await rows('site_content');
  assert.equal(await page.locator('#timeline .tl-item').count(), timeline.length);
  assert.equal(await page.locator('#timeline .tl-item h3').first().textContent(), timeline.sort((a, b) => a.position - b.position)[0].title);
  assert.equal(await page.locator('#heroVisual .kpi').count(), 4);
  const skills = site.find(r => r.key === 'skills').value;
  assert.equal(await page.locator('#servicos .skills .chip').count(), skills.length);
  assert.equal(await page.locator('#projectsGrid .project').count(), (await rows('articles', ['published', true])).length);
  assert.deepEqual(errors, []);
  await page.close();
});

await step('a página não aparece vazia: <main> fica oculto até o conteúdo chegar', async () => {
  const page = await browser.newPage();
  await page.route(/supabase\.co/, async (r) => { await new Promise(res => setTimeout(res, 1500)); await r.continue(); });
  await page.goto(`${BASE}/index.html`);
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('main')).visibility), 'hidden');
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('main')).visibility), 'visible');
  assert.equal(await page.locator('#works .work').count(), 3);
  await page.close();
});

for (const [path, check] of [
  ['index.html', async (p) => assert.equal(await p.locator('#works .work').count(), 3)],
  ['projetos.html', async (p) => assert.ok(await p.locator('a.entry').count() > 0)],
  ['artigos.html', async (p) => assert.ok(await p.locator('a.entry').count() > 0)],
  ['projeto.html?p=copiloto', async (p) => assert.doesNotMatch(await p.title(), /não encontrado/)],
  ['artigo.html?a=desenhar-confianca', async (p) => assert.doesNotMatch(await p.title(), /não encontrado/)],
]) {
  await step(`cópia de reserva com o Supabase bloqueado: ${path}`, async () => {
    const { page, errors } = await open(path, { block: true });
    await check(page);
    assert.deepEqual(errors, []);
    await page.close();
  });
}

await step('sem login, nenhuma escrita passa pela RLS', async () => {
  const ins = await db.from('projects').insert({ id: 'rls-probe', title: 'x', summary: 'x' });
  assert.ok(ins.error, 'insert em projects deveria falhar');
  const insA = await db.from('articles').insert({ id: 'rls-probe', title: 'x', summary: 'x', date: '2026-01-01' });
  assert.ok(insA.error, 'insert em articles deveria falhar');
  const insT = await db.from('timeline').insert({ kind: 'trabalho', period: 'x', title: 'x' });
  assert.ok(insT.error, 'insert em timeline deveria falhar');
  const upd = await db.from('site_content').update({ value: [] }).eq('key', 'skills').select();
  assert.ok(upd.error || upd.data.length === 0, 'update em site_content deveria afetar 0 linhas');
  const del = await db.from('projects').delete().neq('id', '').select();
  assert.ok(del.error || del.data.length === 0, 'delete em projects deveria afetar 0 linhas');
  const up = await db.storage.from('media').upload(`probe/${Date.now()}.png`, new Blob([PNG], { type: 'image/png' }), { contentType: 'image/png' });
  assert.ok(up.error, 'upload anônimo deveria falhar');
});

await step('estudo de caso: entregas continuam como pílulas e o markdown não aparece cru', async () => {
  // fixed fixture: checks the renderer, not whatever content is in the database today
  const fixture = [{ id: 'e2e-md', position: 0, published: true, featured: false, title: 'E2E', summary: 'Resumo.', cat_label: 'Produto', year: '2026',
    tags: ['UX'], role: 'Papel **em negrito**.', challenge: 'Desafio com *itálico*.', stack: 'Figma', deliver: ['Gestão, incluindo:', '- Criação', 'Outra'],
    article: { intro: 'Intro curta.', sections: [{ id: 's', title: 'Seção', body: ['### Subtítulo', 'Texto **forte** e lista:\n- um\n- dois'] }] } }];
  const page0 = await browser.newPage();
  await page0.route(/\/rest\/v1\/projects/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixture) }));
  const errors = []; page0.on('pageerror', e => errors.push(e.message));
  await page0.goto(`${BASE}/projeto.html?p=e2e-md`);
  await page0.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  const page = page0;
  assert.equal(await page.locator('.prose h3').first().textContent(), 'Subtítulo');
  assert.equal(await page.locator('.deliver-list li').count(), 2);
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.deliver-list')).display), 'flex');
  assert.doesNotMatch(await page.locator('.prose').innerText(), /\*\*|^#{1,6}\s/m);
  assert.deepEqual(errors, []);
  await page.close();
});

await step('home sem artigos publicados esconde a seção de artigos, sem erros', async () => {
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/\/rest\/v1\/articles/, r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(`${BASE}/index.html`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  assert.equal(await page.locator('#artigos').count(), 0);
  assert.equal(await page.locator('a[href="#artigos"]').count(), 0);
  assert.equal(await page.locator('#works .work').count() > 0, true);
  assert.deepEqual(errors, []);
  await page.close();
});

await step('home: projeto em destaque abre o bento e os outros completam até 3', async () => {
  const mk = (id, position, featured = false) => ({ id, position, published: true, featured, title: id.toUpperCase(), summary: 's', cat_label: 'Produto', year: '2026', tags: ['UX'], article: { intro: '', sections: [] } });
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/\/rest\/v1\/projects/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([mk('a', 0), mk('b', 1), mk('c', 2), mk('d', 3, true)]) }));
  await page.goto(`${BASE}/index.html`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  assert.deepEqual(await page.locator('#works .work h3').allTextContents(), ['D', 'A', 'B']);
  assert.deepEqual(errors, []);
  await page.close();
});

await step('imagens: grade por seção, galeria e clique para ampliar', async () => {
  const img = (n) => ({ src: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Crect width='16' height='10' fill='%23${n}'/%3E%3C/svg%3E`, caption: `Imagem ${n}` });
  const fixture = [{ id: 'e2e-img', position: 0, published: true, featured: false, title: 'E2E', summary: 'Resumo.', cat_label: 'Produto', year: '2026',
    tags: ['UX'], role: 'Papel.', challenge: 'Desafio.', stack: 'Figma', deliver: ['Uma'], gallery: [img('111'), img('222'), img('333')],
    article: { intro: 'Intro.', sections: [{ id: 's', title: 'Seção', body: ['Texto.'], images: [img('444'), img('555')] }] } }];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/\/rest\/v1\/projects/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixture) }));
  await page.goto(`${BASE}/projeto.html?p=e2e-img`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  assert.equal(await page.locator('#s .figure-grid--2 figure').count(), 2);
  assert.equal(await page.locator('#galeria .figure-grid--3 figure').count(), 3);
  assert.equal(await page.locator('.toc a[href="#galeria"]').count(), 1);
  await page.locator('#s .figure img').first().click();
  const box = page.locator('dialog.lightbox[open]');
  await box.waitFor();
  assert.match(await box.locator('figcaption').textContent(), /Imagem 444/);
  await page.keyboard.press('ArrowRight');
  assert.match(await box.locator('figcaption').textContent(), /Imagem 555/);
  await page.keyboard.press('Escape');
  await box.waitFor({ state: 'detached' });
  assert.deepEqual(errors, []);
  await page.close();
});

await step('home: artigo em destaque abre o carrossel', async () => {
  const art = (id, date, featured = false) => ({ id, date, featured, published: true, title: id.toUpperCase(), summary: 's', tags: ['UX'], read_min: 1, sections: [] });
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/\/rest\/v1\/articles/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([art('novo', '2026-09-20'), art('antigo', '2025-01-01', true), art('medio', '2026-01-01')]) }));
  await page.goto(`${BASE}/index.html`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  assert.deepEqual(await page.locator('#projectsGrid .project h3').allTextContents(), ['ANTIGO', 'NOVO', 'MEDIO']);
  assert.deepEqual(errors, []);
  await page.close();
});

await step('home: filtros saem das tags dos artigos e filtram o carrossel', async () => {
  const art = (id, tags) => ({ id, date: '2026-01-01', published: true, title: id.toUpperCase(), summary: 's', tags, read_min: 1, sections: [] });
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/\/rest\/v1\/articles/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([
    art('a', ['UX', 'Acessibilidade']), art('b', ['UX', 'IA', 'Acessibilidade']), art('c', ['UX', 'P&D <x>'])]) }));
  await page.goto(`${BASE}/index.html`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  assert.deepEqual(await page.locator('#artigos .filter').allTextContents(), ['Todos', 'Acessibilidade', 'IA', 'P&D <x>']);
  await page.locator('#artigos .filter', { hasText: 'Acessibilidade' }).click();
  assert.equal(await page.locator('#projectsGrid .project:not(.is-hidden)').count(), 2);
  assert.deepEqual(errors, []);
  await page.close();
});

await step('aviso de portfólio em construção: aparece na primeira visita e some depois de fechar', async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${BASE}/index.html`);
  const notice = page.getByRole('region', { name: 'Aviso' });
  await notice.waitFor({ timeout: 8000 });
  assert.match(await notice.textContent(), /em construção/i);
  await notice.getByRole('button', { name: 'Entendi' }).click();
  await notice.waitFor({ state: 'detached' });
  await page.goto(`${BASE}/projetos.html`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  await page.waitForTimeout(1500);
  assert.equal(await page.getByRole('region', { name: 'Aviso' }).count(), 0);
  const admin = await ctx.newPage(); await admin.goto(`${BASE}/login`); await admin.waitForTimeout(1500);
  assert.equal(await admin.getByRole('region', { name: 'Aviso' }).count(), 0);
  assert.deepEqual(errors, []);
  await ctx.close();
});

await step('texto do admin aparece literal (sem HTML injetado) em projeto, artigo e home', async () => {
  const evil = 'P&D <b>beta</b> "x"';
  const img = 'https://example.com/a.png" onerror="window.__xss=1';
  const proj = { id: 'e2e-esc', position: 0, published: true, featured: true, title: evil, summary: evil, cat_label: evil, year: '2026', tag: evil, img,
    c1: 'red;x', tags: [evil], role: 'Papel.', challenge: 'D.', stack: evil, deliver: ['Uma'], article: { intro: 'I.', sections: [{ id: 's', title: evil, body: ['T.'] }] } };
  const art = { id: 'e2e-esc-a', date: '2026-01-01', published: true, featured: true, title: evil, summary: evil, tags: [evil], tag: evil, img, read_min: 1, project: 'e2e-esc', sections: [{ id: 's', title: evil, body: ['T.'] }] };
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/\/rest\/v1\/projects/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([proj]) }));
  await page.route(/\/rest\/v1\/articles/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([art]) }));
  await page.route(/example\.com/, r => r.fulfill({ status: 404, body: '' }));
  for (const [path, sel] of [['projeto.html?p=e2e-esc', 'h1.art-title'], ['artigo.html?a=e2e-esc-a', 'h1.art-title'], ['index.html', '#works .work h3']]) {
    await page.goto(`${BASE}/${path}`);
    await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
    await page.waitForTimeout(400);
    assert.equal(await page.locator(sel).first().textContent(), evil, path);
    assert.equal(await page.locator('main b:not(.author b):not(.works-more b):not(#cIndex)').count(), 0, `${path}: <b> injetado`);
    assert.equal(await page.evaluate(() => window.__xss), undefined, `${path}: onerror executou`);
  }
  assert.equal(await page.locator('#projectsGrid .project').first().getAttribute('data-tags'), evil);
  assert.deepEqual(errors, []);
  await page.close();
});

await step('projeto só com título e resumo não mostra blocos vazios', async () => {
  const proj = { id: 'e2e-min', position: 0, published: true, title: 'Mínimo', summary: 'Resumo.', tags: [], deliver: [], article: {} };
  const page = await browser.newPage();
  await page.route(/\/rest\/v1\/projects/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([proj]) }));
  await page.goto(`${BASE}/projeto.html?p=e2e-min`);
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'), null, { timeout: 8000 });
  assert.equal(await page.locator('.art-head .eyebrow').count(), 0, 'eyebrow vazio');
  assert.equal(await page.locator('.challenge').count(), 0, 'desafio vazio');
  assert.equal(await page.locator('#entregas, .toc a[href="#entregas"]').count(), 0, 'entregas vazias');
  assert.equal(await page.locator('.art-facts').count(), 0, 'ficha vazia');
  await page.close();
});

await step('/login mostra o formulário e o painel sem sessão manda para lá', async () => {
  const page = await browser.newPage();
  await page.goto(`${BASE}/login`);
  await page.getByRole('button', { name: 'Entrar' }).waitFor();
  await page.getByLabel('E-mail').fill('ninguem@example.com');
  await page.getByLabel('Senha').fill('senha-errada-123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByText('E-mail ou senha incorretos.').waitFor();
  assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, nofollow');
  await page.goto(`${BASE}/admin.html`);
  await page.waitForURL(/\/login(\.html)?$/);
  await page.close();
});

await step('rascunhos não aparecem para visitantes', async () => {
  assert.equal((await rows('projects', ['published', false])).length, 0);
  assert.equal((await rows('articles', ['published', false])).length, 0);
});

await browser.close();
