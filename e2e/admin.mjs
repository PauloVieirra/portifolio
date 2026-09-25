// e2e/admin.mjs — ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run e2e:admin  (com o preview rodando na 4173)
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { createClient } from '@supabase/supabase-js';

process.loadEnvFile('.env');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) { console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no comando.'); process.exit(2); }
const BASE = process.env.BASE_URL || 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const anon = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const admin = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
await admin.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();
page.on('dialog', d => d.accept());
const step = async (name, fn) => { try { await fn(); console.log('✓', name); } catch (e) { console.error('✗', name, '\n  ', e.message); process.exitCode = 1; } };
const toastText = () => page.locator('#adminToast').textContent();
let uploaded = '';

await step('senha errada mostra erro', async () => {
  await page.goto(`${BASE}/admin.html`);
  await page.getByLabel('E-mail').fill(ADMIN_EMAIL);
  await page.getByLabel('Senha').fill('senha-errada-123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByText('E-mail ou senha incorretos.').waitFor();
});

await step('login abre o painel', async () => {
  await page.getByLabel('Senha').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByRole('navigation', { name: 'Seções' }).waitFor();
});

await step('cria projeto rascunho com imagem', async () => {
  await page.goto(`${BASE}/admin.html#projetos`);
  await page.getByRole('button', { name: 'Novo projeto' }).click();
  await page.getByLabel('Título', { exact: true }).fill('Projeto E2E');
  assert.equal(await page.getByLabel('Endereço (slug)').inputValue(), 'projeto-e2e');
  await page.getByLabel('Resumo').fill('Resumo do teste.');
  await page.getByLabel('Capa: enviar arquivo').setInputFiles({ name: 'doc.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  assert.match(await toastText(), /Formato não suportado/);
  await page.getByLabel('Capa: enviar arquivo').setInputFiles({ name: 'capa.png', mimeType: 'image/png', buffer: PNG });
  await page.waitForFunction(() => document.querySelector('.adm-thumb')?.src.includes('/storage/v1/object/public/media/projects/'));
  uploaded = await page.locator('.adm-thumb').first().getAttribute('src');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.getByText('Projeto E2E').waitFor();
  const { data } = await anon.from('projects').select('id').eq('id', 'projeto-e2e');
  assert.equal(data.length, 0, 'rascunho não pode aparecer para visitantes');
});

await step('seção com várias imagens e galeria: salvar e ver no site', async () => {
  await page.locator('.adm-row', { hasText: 'Projeto E2E' }).getByRole('button', { name: 'Editar' }).click();
  await page.getByRole('button', { name: '+ Adicionar seção' }).click();
  await page.getByLabel('Título da seção').last().fill('Telas');
  await page.getByLabel('Texto').last().fill('Duas telas lado a lado.');
  await page.getByLabel('Imagens da seção (opcional): enviar arquivos').last().setInputFiles([
    { name: 'a.png', mimeType: 'image/png', buffer: PNG }, { name: 'b.png', mimeType: 'image/png', buffer: PNG }]);
  await page.waitForFunction(() => document.querySelectorAll('.adm-sections .adm-image-item').length >= 2, null, { timeout: 20000 });
  await page.getByLabel('Galeria (opcional): enviar arquivos').setInputFiles({ name: 'g.png', mimeType: 'image/png', buffer: PNG });
  await page.waitForFunction(() => [...document.querySelectorAll('.adm-image')].some(el => el.textContent.includes('Galeria (opcional)') && el.querySelector('.adm-image-item')), null, { timeout: 20000 });
  await page.getByLabel('Galeria (opcional): legenda da imagem 1').fill('Legenda da galeria');
  uploaded = [uploaded, ...await page.locator('.adm-image-item img').evaluateAll(els => els.map(e => e.src))].filter(Boolean).join('\n');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.locator('#adminToast', { hasText: 'Projeto salvo.' }).waitFor();
  await page.getByRole('button', { name: 'Novo projeto' }).waitFor();
  const { data } = await admin.from('projects').select('article,gallery').eq('id', 'projeto-e2e').single();
  const sec = data.article.sections.find(x => x.title === 'Telas');
  assert.equal(sec.images.length, 2);
  assert.deepEqual(data.gallery.map(g => g.caption), ['Legenda da galeria']);
});

await step('publicar mostra o projeto no site', async () => {
  const row = page.locator('.adm-row', { hasText: 'Projeto E2E' });
  await row.getByRole('button', { name: 'Publicar' }).click();
  await row.getByText('Publicado').waitFor();
  const pub = await browser.newPage();
  await pub.goto(`${BASE}/projeto.html?p=projeto-e2e`);
  await pub.waitForFunction(() => document.documentElement.classList.contains('is-ready'));
  assert.doesNotMatch(await pub.title(), /não encontrado/);
  assert.equal(await pub.locator('.figure-grid--2 figure').count(), 2);
  assert.equal(await pub.locator('#galeria figure').count(), 1);
  await pub.close();
});

await step('artigo vinculado acompanha a troca de slug do projeto', async () => {
  await page.goto(`${BASE}/admin.html#artigos`);
  await page.getByRole('button', { name: 'Novo artigo' }).click();
  await page.getByLabel('Título', { exact: true }).fill('Artigo E2E');
  await page.getByLabel('Resumo').fill('Resumo do artigo.');
  await page.getByLabel('Projeto relacionado').selectOption('projeto-e2e');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.getByText('Artigo E2E').waitFor();
  await page.goto(`${BASE}/admin.html#projetos`);
  await page.locator('.adm-row', { hasText: 'Projeto E2E' }).getByRole('button', { name: 'Editar' }).click();
  await page.getByLabel('Endereço (slug)').fill('projeto-e2e-2');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.locator('.adm-row', { hasText: 'Projeto E2E' }).waitFor();
  const { data } = await admin.from('articles').select('project').eq('id', 'artigo-e2e').single();
  assert.equal(data.project, 'projeto-e2e-2');
});

await step('tag repetida nas bolhas é bloqueada', async () => {
  const before = (await anon.from('site_content').select('value').eq('key', 'hero_bubbles').single()).data.value;
  await page.goto(`${BASE}/admin.html#hero`);
  const other = before[2].tags[0].label;
  await page.getByLabel('Bolha 1, tag 1').fill(` ${other.toLowerCase()} `);
  await page.getByRole('button', { name: 'Salvar bolhas' }).click();
  await page.getByText(/Tag repetida/).waitFor();
  const after = (await anon.from('site_content').select('value').eq('key', 'hero_bubbles').single()).data.value;
  assert.deepEqual(after, before);
});

await step('trajetória, serviços e contato carregam e validam sem gravar', async () => {
  const { data: tl } = await anon.from('timeline').select('title').order('position');
  await page.goto(`${BASE}/admin.html#trajetoria`);
  await page.getByText(tl[0].title, { exact: true }).waitFor();
  await page.goto(`${BASE}/admin.html#servicos`);
  await page.getByRole('button', { name: 'Salvar serviços' }).waitFor();
  const before = (await anon.from('site_content').select('value').eq('key', 'contact').single()).data.value;
  await page.goto(`${BASE}/admin.html#contato`);
  await page.getByLabel('GitHub').fill('github.com/sem-https');
  await page.getByRole('button', { name: 'Salvar contato' }).click();
  await page.getByText(/GitHub: use um link completo/).waitFor();
  const after = (await anon.from('site_content').select('value').eq('key', 'contact').single()).data.value;
  assert.deepEqual(after, before);
});

await step('limpeza: exclui artigo, projeto e imagem de teste', async () => {
  await page.goto(`${BASE}/admin.html#artigos`);
  await page.locator('.adm-row', { hasText: 'Artigo E2E' }).getByRole('button', { name: 'Excluir' }).click();
  await page.locator('.adm-row', { hasText: 'Artigo E2E' }).waitFor({ state: 'detached' });
  await page.goto(`${BASE}/admin.html#projetos`);
  await page.locator('.adm-row', { hasText: 'Projeto E2E' }).getByRole('button', { name: 'Excluir' }).click();
  await page.locator('.adm-row', { hasText: 'Projeto E2E' }).waitFor({ state: 'detached' });
  const paths = [...new Set(uploaded.split('\n').filter(u => u.includes('/object/public/media/')).map(u => u.split('/object/public/media/')[1]))];
  if (paths.length) {
    const { error } = await admin.storage.from('media').remove(paths);
    assert.ifError(error);
  }
});

await browser.close();
