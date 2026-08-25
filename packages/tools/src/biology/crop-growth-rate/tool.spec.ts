import { describe, expect, it } from "vitest";
import { cropGrowthRateExample, runCropGrowthRate } from "./tool.js";

describe("Crop Growth Rate", () => {
  it("publishes an executable example", () =>
    expect(runCropGrowthRate(cropGrowthRateExample.input)).toEqual({
      ok: true,
      output: cropGrowthRateExample.output,
    }));
  it("calculates a valid result", () =>
    expect(
      runCropGrowthRate({
        daysElapsed: 50,
        dryMassW1G: 0,
        dryMassW2G: 1000,
        groundAreaM2: 10,
      }),
    ).toEqual({ ok: true, output: { cgrGM2PerDay: 2 } }));
  it("is negative during senescence", () =>
    expect(
      runCropGrowthRate({
        daysElapsed: 30,
        dryMassW1G: 350,
        dryMassW2G: 200,
        groundAreaM2: 2.5,
      }),
    ).toEqual({ ok: true, output: { cgrGM2PerDay: -2 } }));
  it("is zero for bare ground", () =>
    expect(
      runCropGrowthRate({
        daysElapsed: 10,
        dryMassW1G: 0,
        dryMassW2G: 0,
        groundAreaM2: 1,
      }),
    ).toEqual({ ok: true, output: { cgrGM2PerDay: 0 } }));
  it("rejects degenerate days", () => {
    const result = runCropGrowthRate({
      daysElapsed: 0,
      dryMassW1G: 200,
      dryMassW2G: 350,
      groundAreaM2: 2.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("degenerate_days");
  });
  it("rejects zero ground area", () =>
    expect(
      runCropGrowthRate({
        daysElapsed: 30,
        dryMassW1G: 200,
        dryMassW2G: 350,
        groundAreaM2: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative masses", () =>
    expect(
      runCropGrowthRate({
        daysElapsed: 30,
        dryMassW1G: -5,
        dryMassW2G: 350,
        groundAreaM2: 2.5,
      }).ok,
    ).toBe(false));
});
