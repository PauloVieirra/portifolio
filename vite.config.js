import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Multi-page site: every HTML file at the root is its own entry (and its own URL).
const pages = ['index', 'projetos', 'projeto', 'artigos', 'artigo', 'design-system'];

/* The page scripts used to be classic scripts at the end of <body>, so the content they render
   (bento, carousel, case study, article) was in the DOM before the first paint — which the
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
  plugins: [renderBlockingEntries()],
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
