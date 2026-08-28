import { describe, expect, it } from "vitest";
import {
  chromatographyRetentionFactorExample,
  runChromatographyRetentionFactor,
} from "./tool.js";
describe("Retention Factor k", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographyRetentionFactor(
        chromatographyRetentionFactorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: chromatographyRetentionFactorExample.output,
    }));
  it("returns zero for unretained analytes", () =>
    expect(
      runChromatographyRetentionFactor({ retentionTimeMin: 2, deadTimeMin: 2 }),
    ).toEqual({ ok: true, output: { retentionFactor: 0 } }));
  it("returns a fractional factor near the dead time", () =>
    expect(
      runChromatographyRetentionFactor({ retentionTimeMin: 3, deadTimeMin: 2 }),
    ).toEqual({ ok: true, output: { retentionFactor: 0.5 } }));
  it("rejects retention before the dead time", () =>
    expect(
      runChromatographyRetentionFactor({ retentionTimeMin: 1, deadTimeMin: 2 }),
    ).toMatchObject({ ok: false }));
  it("grows linearly with adjusted retention time", () => {
    const result = runChromatographyRetentionFactor({
      retentionTimeMin: 20.5,
      deadTimeMin: 2.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.retentionFactor).toBeCloseTo(7.2, 12);
  });
  it("rejects zero dead time", () =>
    expect(
      runChromatographyRetentionFactor({ retentionTimeMin: 10, deadTimeMin: 0 })
        .ok,
    ).toBe(false));
  it("rejects negative dead time", () =>
    expect(
      runChromatographyRetentionFactor({
        retentionTimeMin: 10,
        deadTimeMin: -2,
      }).ok,
    ).toBe(false));
  it("rejects zero retention time", () =>
    expect(
      runChromatographyRetentionFactor({ retentionTimeMin: 0, deadTimeMin: 2 })
        .ok,
    ).toBe(false));
});
