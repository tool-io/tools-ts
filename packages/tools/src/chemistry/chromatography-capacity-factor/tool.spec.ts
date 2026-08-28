import { describe, expect, it } from "vitest";
import {
  chromatographyCapacityFactorExample,
  runChromatographyCapacityFactor,
} from "./tool.js";
describe("Capacity Factor k'", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographyCapacityFactor(
        chromatographyCapacityFactorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: chromatographyCapacityFactorExample.output,
    }));
  it("approaches zero just past the dead time", () =>
    expect(
      runChromatographyCapacityFactor({
        retentionTimeMin: 2.02,
        deadTimeMin: 2,
      }),
    ).toEqual({ ok: true, output: { capacityFactor: 0.010000000000000009 } }));
  it("grows linearly with adjusted retention time", () =>
    expect(
      runChromatographyCapacityFactor({ retentionTimeMin: 14, deadTimeMin: 2 }),
    ).toEqual({ ok: true, output: { capacityFactor: 6 } }));
  it("matches a fractional case closely", () => {
    const result = runChromatographyCapacityFactor({
      retentionTimeMin: 5.5,
      deadTimeMin: 1.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.capacityFactor).toBeCloseTo(2.666667, 6);
  });
  it("rejects retention times equal to the dead time", () =>
    expect(
      runChromatographyCapacityFactor({ retentionTimeMin: 2, deadTimeMin: 2 })
        .ok,
    ).toBe(false));
  it("rejects retention times before the dead time", () =>
    expect(
      runChromatographyCapacityFactor({ retentionTimeMin: 1, deadTimeMin: 2 })
        .ok,
    ).toBe(false));
  it("rejects zero dead time", () =>
    expect(
      runChromatographyCapacityFactor({ retentionTimeMin: 8, deadTimeMin: 0 })
        .ok,
    ).toBe(false));
  it("rejects negative dead time", () =>
    expect(
      runChromatographyCapacityFactor({ retentionTimeMin: 8, deadTimeMin: -1 })
        .ok,
    ).toBe(false));
});
