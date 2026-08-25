import { describe, expect, it } from "vitest";
import { eviVegetationIndexExample, runEviVegetationIndex } from "./tool.js";

describe("EVI Calculator", () => {
  it("publishes an executable example", () =>
    expect(runEviVegetationIndex(eviVegetationIndexExample.input)).toEqual({
      ok: true,
      output: eviVegetationIndexExample.output,
    }));
  it("ignores atmospheric correction when blue is zero", () => {
    const result = runEviVegetationIndex({
      blueReflectance: 0,
      nirReflectance: 0.5,
      redReflectance: 0.1,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.evi).toBeCloseTo(0.47619047619047616, 12);
  });
  it("is signed and negative when red dominates", () => {
    const result = runEviVegetationIndex({
      blueReflectance: 0.1,
      nirReflectance: 0.1,
      redReflectance: 0.4,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.evi).toBe(-0.2727272727272727);
  });
  it("increases with near-infrared reflectance", () => {
    const low = runEviVegetationIndex({
      blueReflectance: 0.05,
      nirReflectance: 0.4,
      redReflectance: 0.1,
    });
    const high = runEviVegetationIndex({
      blueReflectance: 0.05,
      nirReflectance: 0.6,
      redReflectance: 0.1,
    });
    if (low.ok && high.ok)
      expect(Number(high.output.evi)).toBeGreaterThan(Number(low.output.evi));
    else expect.fail("both calculations should succeed");
  });
  it("rejects degenerate reflectances that zero the denominator", () => {
    const result = runEviVegetationIndex({
      blueReflectance: 0.13333333333333333,
      nirReflectance: 0,
      redReflectance: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("degenerate_reflectances");
  });
  it("rejects reflectances above one", () =>
    expect(
      runEviVegetationIndex({
        blueReflectance: 0.05,
        nirReflectance: 0.5,
        redReflectance: 1.5,
      }).ok,
    ).toBe(false));
  it("rejects negative reflectances", () =>
    expect(
      runEviVegetationIndex({
        blueReflectance: -0.05,
        nirReflectance: 0.5,
        redReflectance: 0.1,
      }).ok,
    ).toBe(false));
});
