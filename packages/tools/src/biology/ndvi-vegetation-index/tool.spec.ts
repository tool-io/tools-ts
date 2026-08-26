import { describe, expect, it } from "vitest";
import { ndviVegetationIndexExample, runNdviVegetationIndex } from "./tool.js";

describe("NDVI Calculator", () => {
  it("publishes an executable example", () =>
    expect(runNdviVegetationIndex(ndviVegetationIndexExample.input)).toEqual({
      ok: true,
      output: ndviVegetationIndexExample.output,
    }));
  it("returns zero for bare soil with equal reflectances", () =>
    expect(
      runNdviVegetationIndex({ nirReflectance: 0.3, redReflectance: 0.3 }),
    ).toEqual({
      ok: true,
      output: { ndvi: 0 },
    }));
  it("reaches one for dense canopy without red reflectance", () =>
    expect(
      runNdviVegetationIndex({ nirReflectance: 0.8, redReflectance: 0 }),
    ).toEqual({
      ok: true,
      output: { ndvi: 1 },
    }));
  it("is negative when red exceeds near infrared", () => {
    const result = runNdviVegetationIndex({
      nirReflectance: 0.05,
      redReflectance: 0.4,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.ndvi).toBeCloseTo(-0.7777777777777778, 12);
  });
  it("scales linearly across a vegetation gradient", () => {
    const result = runNdviVegetationIndex({
      nirReflectance: 0.45,
      redReflectance: 0.05,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ndvi).toBeCloseTo(0.8, 12);
  });
  it("rejects dark pixels whose reflectances sum to zero", () => {
    const result = runNdviVegetationIndex({
      nirReflectance: 0,
      redReflectance: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("dark_pixel");
  });
  it("rejects reflectances above one", () =>
    expect(
      runNdviVegetationIndex({ nirReflectance: 1.2, redReflectance: 0.1 }).ok,
    ).toBe(false));
  it("rejects negative reflectances", () =>
    expect(
      runNdviVegetationIndex({ nirReflectance: 0.5, redReflectance: -0.1 }).ok,
    ).toBe(false));
});
