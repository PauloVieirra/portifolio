import { describe, it, expect } from 'vitest';
import {
  slugify, validateSlug, findDuplicateTags, validateBubbles, validateContact,
  validateImage, paragraphs, joinParagraphs, normalizeSections, nextPosition, normalizeImages,
} from '../src/lib/admin-rules.js';

const bubble = (value, ...tags) => ({ value, label: 'Rótulo', tags: tags.map(label => ({ label, icon: 'i-atom' })) });

describe('slugify', () => {
  it('strips accents, lowercases, hyphenates', () => expect(slugify('Inovação & IA: Guia 2026!')).toBe('inovacao-ia-guia-2026'));
  it('trims hyphens', () => expect(slugify('  --Olá--  ')).toBe('ola'));
});

describe('validateSlug', () => {
  it('requires a value', () => expect(validateSlug('', [])).toMatch(/Informe/));
  it('rejects bad format', () => expect(validateSlug('Meu Projeto', [])).toMatch(/minúsculas/));
  it('rejects taken ids', () => expect(validateSlug('lumen', ['lumen'])).toMatch(/Já existe/));
  it('allows keeping its own id', () => expect(validateSlug('lumen', ['lumen'], 'lumen')).toBe(true));
});

describe('findDuplicateTags', () => {
  it('matches across bubbles ignoring case, accents and spaces', () => {
    expect(findDuplicateTags([bubble('A', 'Supabase', 'Figma'), bubble('B', ' supabáse ')])).toEqual(['Supabase']);
  });
  it('returns [] when unique', () => expect(findDuplicateTags([bubble('A', 'React'), bubble('B', 'React Native')])).toEqual([]));
});

describe('validateBubbles', () => {
  const four = () => [bubble('UX', 'a'), bubble('1.5M', 'b'), bubble('Code', 'c'), bubble('IA', 'd')];
  it('accepts a valid set', () => expect(validateBubbles(four())).toEqual([]));
  it('requires exactly 4', () => expect(validateBubbles(four().slice(0, 3))[0]).toMatch(/exatamente 4/));
  it('flags empty value, empty tag, bad icon, duplicates, >10 tags', () => {
    const b = four();
    b[0].value = ' ';
    b[1].tags.push({ label: '', icon: 'i-atom' });
    b[2].tags[0].icon = 'i-nope';
    b[3].tags.push({ label: 'A', icon: 'i-atom' });
    const errs = validateBubbles(b).join('\n');
    expect(errs).toMatch(/Bolha 1: informe o valor/);
    expect(errs).toMatch(/Bolha 2: há uma tag sem nome/);
    expect(errs).toMatch(/Bolha 3: ícone inválido/);
    expect(errs).toMatch(/Tag repetida: “a”/);
    const many = four(); many[0].tags = Array.from({ length: 11 }, (_, i) => ({ label: `t${i}`, icon: 'i-atom' }));
    expect(validateBubbles(many).join()).toMatch(/no máximo 10/);
  });
});

describe('validateContact', () => {
  it('accepts email + empty links', () => expect(validateContact({ email: 'a@b.co', linkedin: '', github: '', dribbble: '' })).toEqual([]));
  it('rejects bad email and non-http links', () => {
    const errs = validateContact({ email: 'x', linkedin: 'linkedin.com/in/x', github: '', dribbble: '' }).join();
    expect(errs).toMatch(/E-mail/); expect(errs).toMatch(/LinkedIn/);
  });
});

describe('validateImage', () => {
  it('accepts a 1 MB png', () => expect(validateImage({ type: 'image/png', size: 1e6 })).toBe(true));
  it('rejects pdf', () => expect(validateImage({ type: 'application/pdf', size: 10 })).toMatch(/Formato/));
  it('rejects 6 MB', () => expect(validateImage({ type: 'image/jpeg', size: 6 * 1024 * 1024 })).toMatch(/5 MB/));
});

describe('paragraphs', () => {
  it('splits on blank lines and keeps line breaks (lists)', () => expect(paragraphs('a\n- b\n\n\n c ')).toEqual(['a\n- b', 'c']));
  it('round-trips', () => expect(paragraphs(joinParagraphs(['x', 'y']))).toEqual(['x', 'y']));
});

describe('normalizeSections', () => {
  it('assigns unique ids, drops empty sections and empty figure/quote', () => {
    const out = normalizeSections([
      { title: 'Contexto', body: ['a'], quote: ' ', figure: { src: '', caption: '' } },
      { title: 'Contexto', body: ['b'], quote: 'q', figure: { src: 'x.png', caption: '' } },
      { title: ' ', body: [] },
    ], { quote: true });
    expect(out).toEqual([
      { id: 'contexto', title: 'Contexto', body: ['a'] },
      { id: 'contexto-2', title: 'Contexto', body: ['b'], quote: 'q', images: [{ src: 'x.png', caption: '' }] },
    ]);
  });
  it('keeps several images per section, dropping empty ones', () => {
    const [s0] = normalizeSections([{ title: 'T', body: ['a'], images: [{ src: ' a.png ', caption: ' A ' }, { src: '', caption: '' }, { src: 'b.png' }] }], { quote: false });
    expect(s0.images).toEqual([{ src: 'a.png', caption: 'A' }, { src: 'b.png', caption: '' }]);
    expect(s0.figure).toBeUndefined();
  });
  it('drops quote when not allowed', () => expect(normalizeSections([{ title: 'T', body: ['a'], quote: 'q' }], { quote: false })[0].quote).toBeUndefined());
});

describe('nextPosition', () => {
  it('is 0 for empty and max+1 otherwise', () => {
    expect(nextPosition([])).toBe(0);
    expect(nextPosition([{ position: 2 }, { position: 7 }])).toBe(8);
  });
});

describe('normalizeImages', () => {
  it('trims and drops images without src', () => expect(normalizeImages([{ src: ' g.png ', caption: ' G ' }, { src: ' ', caption: 'x' }])).toEqual([{ src: 'g.png', caption: 'G' }]));
  it('accepts nothing', () => expect(normalizeImages(undefined)).toEqual([]));
});
