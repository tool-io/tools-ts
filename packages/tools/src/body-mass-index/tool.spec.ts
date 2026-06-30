import { describe, expect, it } from 'vitest';
import fixtures from '../../../../fixtures/body-mass-index.json' with {
  type: 'json'
};
import {
  bodyMassIndexTool,
  calculateBodyMassIndex
} from './tool.js';

describe('body mass index', () => {
  it('matches the portable conformance fixtures', () => {
    for (const fixture of fixtures) {
      const result = calculateBodyMassIndex(fixture.input);
      const output = fixture.output;
      if (output !== undefined) {
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.output.bmi).toBeCloseTo(
            output.bmi,
            12
          );
        }
      } else {
        expect(result).toMatchObject({
          error: { code: fixture.error },
          ok: false
        });
      }
    }
  });

  it('publishes a stable pure-tool contract', () => {
    expect(bodyMassIndexTool).toMatchObject({
      contractVersion: 1,
      execution: { kind: 'pure' },
      id: 'body-mass-index'
    });
  });

  it('never returns undefined for malformed input', () => {
    expect(calculateBodyMassIndex(undefined)).toMatchObject({
      error: { code: 'invalid_input' },
      ok: false
    });
  });
});
