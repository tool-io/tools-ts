import { describe, expect, it } from 'vitest';

import {
  compareShoeSizes,
  createShoeSizeTable,
  shoeSizeTool
} from './tool.js';

describe('shoe size comparison', () => {
  it('converts a US mens 10 through foot length', () => {
    const result = compareShoeSizes({
      profile: 'men',
      size: 10,
      system: 'us'
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.footLengthMm).toBeCloseTo(279.4, 1);
    expect(
      result.output.matches.find((match) => match.system === 'eu')?.label
    ).toBe('44');
    expect(
      result.output.matches.find((match) => match.system === 'uk')?.label
    ).toBe('9.5');
  });

  it('keeps US womens sizing distinct', () => {
    const result = compareShoeSizes({
      profile: 'women',
      size: 10,
      system: 'us'
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.output.matches.find((match) => match.system === 'eu')?.label
    ).toBe('42');
  });

  it('accepts child and youth labels', () => {
    const result = compareShoeSizes({
      profile: 'children',
      size: '1Y',
      system: 'us'
    });
    expect(result.ok).toBe(true);
  });

  it('creates complete ordered comparison rows', () => {
    const rows = createShoeSizeTable('men');
    expect(rows.length).toBeGreaterThan(20);
    expect(rows[0]?.matches).toHaveLength(7);
    expect(rows.at(-1)?.footLengthMm).toBe(325);
  });

  it('returns a typed invalid-input result and never undefined', () => {
    expect(compareShoeSizes(undefined)).toEqual({
      error: {
        code: 'invalid_input',
        issues: [
          {
            code: 'object_required',
            field: '',
            message: 'Input must be an object.'
          }
        ]
      },
      ok: false
    });
    expect(shoeSizeTool.execute({ profile: 'men', size: '', system: 'us' }).ok)
      .toBe(false);
  });
});
