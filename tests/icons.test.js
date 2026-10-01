import { describe, it, expect } from 'vitest';
import { ICONS, ICON_LABELS } from '../src/lib/icons.js';
import { readPage } from '../scripts/lib/partials.mjs';

describe('ICONS', () => {
  const html = readPage('index.html');
  const sprite = [...html.matchAll(/<symbol id="([^"]+)"/g)].map(m => m[1]);
  it('lists exactly the sprite symbols', () => expect([...ICONS].sort()).toEqual([...sprite].sort()));
  it('has a label for each icon', () => ICONS.forEach(id => expect(ICON_LABELS[id]).toBeTruthy()));
});
