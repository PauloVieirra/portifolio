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
