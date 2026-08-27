import { describe, expect, it } from "vitest";
import { quadratDensityExample, runQuadratDensity } from "./tool.js";

describe("Quadrat Density", () => {
  it("matches the canonical example", () => {
    expect(runQuadratDensity(quadratDensityExample.input)).toEqual({
      ok: true,
      output: quadratDensityExample.output,
    });
  });

  it("computes a fractional density exactly", () => {
    expect(
      runQuadratDensity({ organismsCounted: 25, quadratAreaM2: 10 }),
    ).toEqual({ ok: true, output: { densityPerSquareMeter: 2.5 } });
  });

  it("allows an empty quadrat", () => {
    expect(
      runQuadratDensity({ organismsCounted: 0, quadratAreaM2: 8 }),
    ).toEqual({ ok: true, output: { densityPerSquareMeter: 0 } });
  });

  it("computes density for a one square meter quadrat", () => {
    expect(
      runQuadratDensity({ organismsCounted: 37, quadratAreaM2: 1 }),
    ).toEqual({ ok: true, output: { densityPerSquareMeter: 37 } });
  });

  it("rejects zero area through the schema", () => {
    const result = runQuadratDensity({
      organismsCounted: 48,
      quadratAreaM2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "quadratAreaM2",
      });
  });

  it("rejects negative area and negative counts through the schema", () => {
    expect(
      runQuadratDensity({ organismsCounted: 48, quadratAreaM2: -12 }).ok,
    ).toBe(false);
    expect(
      runQuadratDensity({ organismsCounted: -3, quadratAreaM2: 12 }).ok,
    ).toBe(false);
  });

  it("rejects fractional counts and missing required input", () => {
    expect(
      runQuadratDensity({ organismsCounted: 12.5, quadratAreaM2: 2 }).ok,
    ).toBe(false);
    expect(runQuadratDensity({ organismsCounted: 48 }).ok).toBe(false);
  });
});
