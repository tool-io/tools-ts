import { describe, expect, it } from "vitest";
import {
  relativeGrowthRatePlantExample,
  runRelativeGrowthRatePlant,
} from "./tool.js";

describe("Relative Growth Rate", () => {
  it("publishes an executable example", () =>
    expect(
      runRelativeGrowthRatePlant(relativeGrowthRatePlantExample.input),
    ).toEqual({
      ok: true,
      output: relativeGrowthRatePlantExample.output,
    }));
  it("calculates doubling over five days", () =>
    expect(
      runRelativeGrowthRatePlant({
        daysElapsed: 5,
        finalMassG: 20,
        initialMassG: 10,
      }),
    ).toEqual({ ok: true, output: { rgrPerDay: 0.138629436111989 } }));
  it("is negative for shrinking plants", () =>
    expect(
      runRelativeGrowthRatePlant({
        daysElapsed: 5,
        finalMassG: 10,
        initialMassG: 20,
      }),
    ).toEqual({ ok: true, output: { rgrPerDay: -0.138629436111989 } }));
  it("is zero for unchanged mass", () =>
    expect(
      runRelativeGrowthRatePlant({
        daysElapsed: 5,
        finalMassG: 15,
        initialMassG: 15,
      }),
    ).toEqual({ ok: true, output: { rgrPerDay: 0 } }));
  it("accepts fractional days", () =>
    expect(
      runRelativeGrowthRatePlant({
        daysElapsed: 0.5,
        finalMassG: 20,
        initialMassG: 10,
      }),
    ).toEqual({
      ok: true,
      output: { rgrPerDay: 1.38629436111989 },
    }));
  it("rejects zero initial mass", () =>
    expect(
      runRelativeGrowthRatePlant({
        daysElapsed: 5,
        finalMassG: 20,
        initialMassG: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero final mass", () =>
    expect(
      runRelativeGrowthRatePlant({
        daysElapsed: 5,
        finalMassG: 0,
        initialMassG: 10,
      }).ok,
    ).toBe(false));
  it("rejects degenerate days", () => {
    const result = runRelativeGrowthRatePlant({
      daysElapsed: 0,
      finalMassG: 20,
      initialMassG: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("degenerate_days");
  });
});
