# Autenticação e área de gestão de conteúdo — design

Data: 2026-09-24 · Status: aprovado em conversa, aguardando revisão do documento

## Objetivo

Paulo (único usuário) faz login e mantém todo o conteúdo que muda com o tempo — projetos, artigos, imagens,
trajetória (empregos e cursos), bolhas do hero, serviços e contato — sem editar código. Salvar no admin
atualiza o site público no próximo carregamento de página, sem rebuild nem deploy.

Critérios de sucesso

- Só o Paulo consegue gravar; a proteção está no banco (RLS), não só na interface.
- O site público mantém o visual e as interações atuais, inclusive o conteúdo presente na primeira pintura
  (view transitions entre páginas).
- Se o Supabase falhar, o site continua exibindo conteúdo (cópia de reserva).
- O conteúdo atual é o ponto de partida do banco.

Fora de escopo (desta rodada): gravar mensagens do formulário de contato, múltiplos usuários/papéis,
histórico de versões, editor rich text, otimização/redimensionamento de imagens.

## Stack

Vite multi-página + JS puro (sem framework), `@supabase/supabase-js` já instalado, client em
`src/lib/supabase.js`, credenciais em `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).

## 1. Banco de dados

Arquivo `supabase/schema.sql` (executado pelo usuário no SQL Editor; idempotente).

### Tabelas

`projects`
| coluna | tipo | notas |
|---|---|---|
| id | text pk | slug; `^[a-z0-9]+(-[a-z0-9]+)*$` |
| position | int not null default 0 | ordem nas listas |
| published | boolean not null default true | rascunho = false |
| featured | boolean not null default false | destaque na home (até 3) |
| title, summary | text not null | |
| cat, cat_label, year, tag | text | `tag` = rótulo curto da capa placeholder |
| tags | text[] not null default '{}' | filtros de projetos.html |
| url, img | text | vazio = "Em breve" / placeholder colorido |
| c1, c2 | text | tokens aurora (`var(--aurora-*-fill)`) |
| challenge, role, stack | text | |
| deliver | text[] not null default '{}' | |
| article | jsonb not null default '{}' | `{ intro, sections: [{ id, title, body: [str], figure?: { src, caption } }] }` |
| updated_at | timestamptz default now() | trigger de atualização |

`articles`
| coluna | tipo | notas |
|---|---|---|
| id | text pk | slug, mesmo formato |
| position | int not null default 0 | desempate; a ordem pública é por `date desc` |
| published | boolean not null default true | |
| date | date not null | |
| read_min | int | |
| tags | text[] not null default '{}' | |
| img, c1, c2, tag | text | |
| project | text references projects(id) on update cascade on delete set null | projeto relacionado |
| title, summary, intro | text | title/summary not null |
| sections | jsonb not null default '[]' | `[{ id, title, body: [str], quote?, figure?: { src, caption } }]` |
| updated_at | timestamptz default now() | |

`timeline`
| coluna | tipo | notas |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| position | int not null default 0 | ordem de exibição (topo = 0) |
| kind | text not null check in ('trabalho','formacao') | |
| period | text not null | texto livre: "2025 — hoje", "Em andamento" |
| title | text not null | |
| org | text | |
| description | text | opcional |
| title_full | text | opcional; vira `title` (tooltip) do h3 |

`site_content`
| coluna | tipo | notas |
|---|---|---|
| key | text pk check in ('hero_bubbles','services','skills','contact') | |
| value | jsonb not null | formatos abaixo |
| updated_at | timestamptz default now() | |

Formatos de `site_content.value`
- `hero_bubbles`: `[{ value, label, tags: [{ label, icon }] }]` — exatamente 4 bolhas (o layout orbital é
  desenhado para 4); `icon` ∈ ids do sprite existente (`i-atom`, `i-js`, …, sem o prefixo `#`).
- `services`: `[{ title, text, items: [str] }]` — exatamente 3 cards.
- `skills`: `[str]`.
- `contact`: `{ email, linkedin, github, dribbble }` — link vazio esconde a pílula.

`admins`: `user_id uuid pk references auth.users on delete cascade`.

### Segurança (RLS em todas as tabelas)

- Função `is_admin()` (security definer, `stable`): `exists(select 1 from admins where user_id = auth.uid())`.
- `projects`, `articles`: select público `using (published or is_admin())`; insert/update/delete `is_admin()`.
- `timeline`, `site_content`: select público; escrita `is_admin()`.
- `admins`: select só `is_admin()`; sem políticas de escrita (gerenciada pelo SQL Editor).
- Storage: bucket `media` público para leitura; insert/update/delete em `storage.objects` com
  `bucket_id = 'media' and is_admin()`.
- Cadastro público desativado no painel (Auth → Sign In / Providers → "Allow new users to sign up" off).

### Carga inicial

`scripts/build-seed.mjs` gera `supabase/seed.sql` a partir de `src/data/projects.js`, `src/data/articles.js` e
do conteúdo atual do `index.html` (bolhas, trajetória, serviços, chips, contato), com `position` na ordem atual.
Usa `on conflict do nothing` para poder ser reexecutado sem sobrescrever edições.

## 2. Site público

`src/lib/content.js`
- `loadContent(keys)` busca em paralelo só o que a página precisa (`projects`, `articles`, `timeline`,
  `site`), com timeout de 2,5 s para o conjunto.
- Converte linhas do banco para o formato que as páginas já usam (`catLabel`, `readMin`, `article`, …) —
  função pura `fromProjectRow` / `fromArticleRow`, testada.
- Falha ou timeout: projetos/artigos vêm de `src/data/*.js` (reserva); `timeline`/`site` retornam `null` e a
  página mantém o HTML estático. Um `console.warn` registra o motivo.
- Filtra `published` no próprio select (a RLS já garante; o filtro evita que o admin logado veja rascunhos no
  site público).

Páginas
- Os módulos de página já são render-blocking; trocam `import { PROJECTS } …` por
  `const { projects } = await loadContent([...])` no topo (top-level await). A primeira pintura espera os dados.
- `home.js`: antes do código das bolhas, `renderHome(site, timeline)` reescreve os kpis/kpi-tags, a trajetória,
  os serviços, os chips e os links de contato. O markup gerado é idêntico ao atual (mesmas classes, `--i`,
  `reveal`, `aria-*`), para CSS e JS existentes funcionarem sem mudança. Links sociais vazios não são
  renderizados.
- `design-system.html` não muda.

## 3. Admin

Entrada `admin.html` (adicionada ao `pages` do `vite.config.js`), `<meta name="robots" content="noindex">`,
sem links a partir do site. CSS em `src/styles/pages/admin.css` importando tokens + components.css.

Módulos em `src/pages/admin/`
- `main.js` — sessão (`onAuthStateChange`), alterna tela de login / painel, roteamento por hash
  (`#projetos`, `#artigos`, `#trajetoria`, `#hero`, `#servicos`, `#contato`).
- `login.js` — email + senha (`signInWithPassword`), mensagem de erro, estado de carregando.
- `ui.js` — helpers de DOM (campos, repetidores, toasts, confirmação de exclusão).
- `projects.js`, `articles.js` — lista (título, status, destaque/data) com publicar/rascunho, subir/descer,
  editar, excluir; formulário completo com repetidor de seções.
- `timeline.js` — lista editável inline com tipo, período, título, organização, descrição, ordem.
- `hero.js` — 4 bolhas (valor, rótulo, tags com seletor de ícone); validação de repetidas.
- `services.js` — 3 cards + lista de chips.
- `contact.js` — email e três links.
- `media.js` — `uploadImage(file, folder)`: valida tipo (jpeg/png/webp/avif) e tamanho (≤ 5 MB), envia para
  `media/<folder>/<uuid>.<ext>`, devolve a URL pública; campo de imagem com preview e "remover".

Lógica pura em `src/lib/admin-rules.js` (testada)
- `slugify(title)` — minúsculas, sem acento, hífens.
- `validateSlug(slug, existingIds, currentId)` — formato + unicidade.
- `findDuplicateTags(bubbles)` — nomes repetidos em qualquer bolha, comparação sem caixa e sem acento,
  ignorando espaços nas pontas.
- `paragraphs(text)` / `joinParagraphs(list)` — textarea ⇄ lista de parágrafos (separados por linha em branco).

Comportamento
- Salvar grava a linha inteira; erros do Supabase aparecem num toast com a mensagem.
- Excluir pede confirmação; excluir projeto avisa quantos artigos perdem o vínculo.
- Renomear o slug de um projeto atualiza os artigos pelo `on update cascade`.
- Link "Ver no site" em cada item publicado.
- Sessão expirada → volta à tela de login; um formulário aberto não salvo é descartado (YAGNI).

## 4. Passos manuais do usuário (documentados no README)

1. SQL Editor → executar `supabase/schema.sql`, depois `supabase/seed.sql`.
2. Auth → Users → "Add user" (email + senha, auto-confirm).
3. Desativar cadastro público.
4. SQL Editor → `insert into admins (user_id) select id from auth.users where email = '<email>';`

## 5. Testes

- Vitest (novo devDependency): `admin-rules.js` e conversores de `content.js`.
- Playwright (script local, fora do bundle):
  - páginas públicas renderizam com dados do Supabase (após o seed);
  - reserva: com as requisições ao Supabase bloqueadas, as páginas renderizam de `src/data` / HTML;
  - sem login, insert/update em cada tabela e upload no bucket são negados pela RLS;
  - fluxo do admin (login, criar/editar/excluir projeto, upload) depois que o usuário existir — executado com
    credenciais fornecidas pelo Paulo na hora, nunca gravadas em arquivo.
- `npm run build` sem erros; `.env` fora do bundle exceto as variáveis `VITE_`.
