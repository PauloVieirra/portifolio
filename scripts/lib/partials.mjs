/* HTML partials: `<!-- @include topnav.html page="servicos" -->` is replaced by src/partials/topnav.html.
   Attributes fill `{{name|default}}` placeholders in the partial; `page` also marks the menu item with
   data-page="<page>" as the current one. Used by vite.config.js (dev and build) and by the scripts and
   tests that read the pages' static HTML. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const PARTIALS_DIR = resolve(import.meta.dirname, '../../src/partials');
const INCLUDE = /<!--\s*@include\s+([\w./-]+)((?:\s+\w+="[^"]*")*)\s*-->/g;

export function expandPartials(html, dir = PARTIALS_DIR) {
  return html.replace(INCLUDE, (_, file, attrs) => {
    const vars = Object.fromEntries([...attrs.matchAll(/(\w+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    let out = readFileSync(resolve(dir, file), 'utf8').trimEnd()
      .replace(/\{\{(\w+)(?:\|([^}]*))?\}\}/g, (_, k, d = '') => vars[k] ?? d);
    if (vars.page) out = out.replaceAll(`data-page="${vars.page}"`, `data-page="${vars.page}" class="is-active" aria-current="page"`);
    return expandPartials(out, dir);
  });
}

/* Reads a page with its partials expanded */
export const readPage = (file) => expandPartials(readFileSync(file, 'utf8'));

/* Blocks the admin manages, as static HTML (the initial content of the seed): the home (hero bubbles), the timeline
   of /trajetoria, the contact of /contato and the service cards the site no longer shows but the admin still edits */
export const readHomeBlocks = () => readPage('index.html') +
  expandPartials('<!-- @include trajetoria.html -->\n<!-- @include contato.html -->\n<!-- @include servicos.html -->');
