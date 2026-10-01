import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { expandPartials, PARTIALS_DIR } from './scripts/lib/partials.mjs';

// Multi-page site: every HTML file at the root is its own entry (and its own URL).
const pages = ['index', 'projetos', 'projeto', 'artigos', 'artigo', 'videos', 'processo', 'trajetoria', 'contato', 'design-system', 'admin', 'login'];

/* <!-- @include … --> in the pages: shared menu and home sections (src/partials) */
const partials = () => ({
  name: 'html-partials',
  transformIndexHtml: { order: 'pre', handler: (html) => expandPartials(html) },
  configureServer(server) {
    server.watcher.add(PARTIALS_DIR);
    server.watcher.on('change', (f) => { if (f.startsWith(PARTIALS_DIR)) server.ws.send({ type: 'full-reload' }); });
  },
});

/* Clean routes (/processo → processo.html) in dev and preview, like the rewrites in vercel.json */
const cleanRoutes = () => {
  const rewrite = (req, _res, next) => {
    const [path, query = ''] = req.url.split('?');
    const name = path.replace(/^\/|\/$/g, '');
    if (pages.includes(name) && name !== 'index') req.url = `/${name}.html${query && '?' + query}`;
    next();
  };
  return {
    name: 'clean-routes',
    configureServer: (server) => { server.middlewares.use(rewrite); },
    configurePreviewServer: (server) => { server.middlewares.use(rewrite); },
  };
};

/* The page scripts used to be classic scripts at the end of <body>, so the content they render
   (bento, carousel, case study, article) was in the DOM before the first paint - which the
   cross-document view transitions (cover morph) rely on. Module scripts are deferred, so each
   page's entry is marked render-blocking. Vite rewrites entry <script> tags on build and drops
   unknown attributes, so the attribute is re-applied to the emitted tags here. */
const renderBlockingEntries = () => ({
  name: 'render-blocking-entries',
  enforce: 'post',
  transformIndexHtml: (html) =>
    html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g,
      '<script type="module" crossorigin src="$1" blocking="render"></script>'),
});

export default defineConfig({
  base: './',
  plugins: [partials(), cleanRoutes(), renderBlockingEntries()],
  build: {
    /* Ship the CSS verbatim. The default minifier (Lightning CSS) folds `backdrop-filter` +
       `-webkit-backdrop-filter` into the prefixed one only, which breaks the glass effect in
       Firefox, and it rewrites other hand-tuned declarations. gzip covers most of the size. */
    cssMinify: false,
    rolldownOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(import.meta.dirname, `${p}.html`)])),
    },
  },
});
