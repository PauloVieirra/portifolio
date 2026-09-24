# Portfólio — Paulo Vieira · UX IA Engineer

Site multi-página em HTML, CSS e JavaScript puros, servido e empacotado com [Vite](https://vite.dev).
Veio de um export do Open Design (ver `design-export/`); a conversão preserva o design pixel a pixel.

## Comandos

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # gera dist/
npm run preview   # serve o dist/ localmente
```

`base: './'` no `vite.config.js`: o `dist/` funciona em qualquer subpasta (GitHub Pages, S3, etc.).

## Estrutura

```
index.html            Home
projetos.html         Arquivo de projetos (busca, filtros, paginação — estado na URL)
projeto.html          Estudo de caso        → projeto.html?p=<id>
artigos.html          Arquivo de artigos
artigo.html           Leitor de artigo      → artigo.html?a=<id>
design-system.html    Catálogo de tokens (página de apoio)

src/
  data/               projects.js, articles.js — fonte única do conteúdo
  pages/              um módulo por página (render + interações)
  lib/                overlays.js (menu mobile), wiki.js (motor de busca/filtros), supabase.js (client)
  styles/
    tokens/           tokens gerados do Design System (não editar à mão)
    components.css    base compartilhada + paleta "aurora"
    wiki.css          listas pesquisáveis
    article.css       layout de leitura
    pages/            CSS de entrada de cada página (importa as camadas na ordem da cascata)
  assets/foto.png     retrato do hero (passa pelo pipeline do Vite)
public/assets/images/ imagens referenciadas pelos dados (campo `img`), servidas sem hash
design-export/        handoff original: DESIGN-HANDOFF.md, manifesto, evidências e o export intacto (zip)
```

## Supabase

`src/lib/supabase.js` exporta o client (`import { supabase } from '../lib/supabase.js'`). URL e chave
publishable ficam em `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). A chave publishable vai para o
navegador por design; o que cada visitante pode ler/gravar é definido pelas políticas RLS das tabelas.

## Área de gestão (`admin.html`)

Configuração única no painel do Supabase:

1. **SQL Editor** → cole e execute `supabase/schema.sql`; depois `supabase/seed.sql` (conteúdo inicial, gerado por `npm run seed`).
2. **Authentication → Users → Add user**: seu e-mail e uma senha forte, marcando *Auto Confirm User*.
3. **Authentication → Sign In / Providers**: desligue *Allow new users to sign up*.
4. **SQL Editor**: `insert into public.admins (user_id) select id from auth.users where email = 'SEU_EMAIL';`

Depois acesse `/admin.html`. O site público lê o conteúdo publicado a cada carregamento; se o Supabase não responder em 2,5 s,
usa a cópia de `src/data/` e o HTML estático da home.

## Conteúdo

Projetos e artigos são editados só em `src/data/`. Os campos estão documentados no topo de cada arquivo.
Imagens de capa/figuras (`img`, `figure.src`) vão em `public/assets/images/` e são referenciadas como
`assets/images/arquivo.png`.

## Decisões que preservam a fidelidade

- **Um CSS por página com `@import` na ordem original.** Vários `<link>` separados fazem o Vite dividir o CSS
  em chunks e reordenar a cascata.
- **`build.cssMinify: false`.** O minificador padrão (Lightning CSS) junta `backdrop-filter` com
  `-webkit-backdrop-filter` e mantém só o prefixado, o que apaga o efeito de vidro no Firefox.
- **Scripts de página com `blocking="render"`.** Os scripts originais rodavam no fim do `<body>`, antes da
  primeira pintura; módulos são adiados. O atributo (reaplicado no build por um plugin em `vite.config.js`)
  mantém o conteúdo renderizado antes do primeiro frame — necessário para as view transitions entre páginas.
- O script inline no `<head>` da home (`--vh` / `.is-canvas`) foi mantido como está: só age dentro de frames de
  preview mais altos que a tela e é inerte num navegador normal.
