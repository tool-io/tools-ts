import { describe, expect, it } from 'vitest';

import { compareSizes, sizeTool } from './tool.js';

describe('general size tool', () => {
  it('dispatches to an independently importable size tool', () => {
    const result = compareSizes({
      item: 'shoe',
      profile: 'men',
      size: 10,
      system: 'us'
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.item).toBe('shoe');
    if (!('matches' in result.output)) return;
    expect(result.output.matches).toHaveLength(7);
  });

  it('dispatches bed sizes through the general size tool', () => {
    const result = compareSizes({ item: 'bed', market: 'us', size: 'queen' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.item).toBe('bed');
    if (!('matches' in result.output)) return;
    expect(result.output.matches).toHaveLength(5);
  });

  it('dispatches measurement-based tools through the general size tool', () => {
    const result = compareSizes({ item: 'belt', values: { waist: 86 } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.item).toBe('belt');
  });

  it('rejects unsupported tools explicitly', () => {
    const result = sizeTool.execute({
      item: 'not-a-size-tool',
      profile: 'men',
      size: 32,
      system: 'us'
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe('unsupported_item');
  });
});
