import { describe, it, expect } from 'vitest';
import { sqlString, sqlValue, insertSQL } from '../scripts/lib/sql.mjs';

describe('sql', () => {
  it('escapes quotes', () => expect(sqlString("d'água")).toBe("'d''água'"));
  it('encodes by type', () => {
    expect(sqlValue(null, 'x')).toBe('null');
    expect(sqlValue(true, 'x')).toBe('true');
    expect(sqlValue(['a', "b'"], 'tags')).toBe("array['a', 'b''']");
    expect(sqlValue([], 'tags')).toBe("'{}'::text[]");
    expect(sqlValue([], 'sections')).toBe("'[]'::jsonb");
    expect(sqlValue({ a: "it's" }, 'article')).toBe(`'{"a":"it''s"}'::jsonb`);
  });
  it('builds an idempotent insert', () => {
    expect(insertSQL('t', [{ id: 'a', n: 1 }], 'id')).toBe("insert into public.t (id, n) values\n  ('a', 1)\non conflict (id) do nothing;\n");
  });
});
