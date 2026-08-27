import { describe, expect, it } from "vitest";
import { runWoodDensity, woodDensityExample } from "./tool.js";

describe("Wood Density", () => {
  it("publishes an executable example", () =>
    expect(runWoodDensity(woodDensityExample.input)).toEqual({
      ok: true,
      output: woodDensityExample.output,
    }));
  it("calculates a valid result", () =>
    expect(runWoodDensity({ dryMassG: 90, volumeCm3: 120 })).toEqual({
      ok: true,
      output: { woodDensity: 0.75 },
    }));
  it("is one for equal mass and volume", () =>
    expect(runWoodDensity({ dryMassG: 50, volumeCm3: 50 })).toEqual({
      ok: true,
      output: { woodDensity: 1 },
    }));
  it("distinguishes light and heavy timbers", () =>
    expect(runWoodDensity({ dryMassG: 90, volumeCm3: 450 })).toEqual({
      ok: true,
      output: { woodDensity: 0.2 },
    }));
  it("accepts fractional volumes", () =>
    expect(runWoodDensity({ dryMassG: 6.5, volumeCm3: 10 })).toEqual({
      ok: true,
      output: { woodDensity: 0.65 },
    }));
  it("rejects zero volume", () => {
    const result = runWoodDensity({ dryMassG: 65, volumeCm3: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("volumeCm3");
  });
  it("rejects negative mass", () =>
    expect(runWoodDensity({ dryMassG: -65, volumeCm3: 100 }).ok).toBe(false));
  it("rejects non-finite mass", () =>
    expect(
      runWoodDensity({
        dryMassG: Number.POSITIVE_INFINITY,
        volumeCm3: 100,
      }).ok,
    ).toBe(false));
});
