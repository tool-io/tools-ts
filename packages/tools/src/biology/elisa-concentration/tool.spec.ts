import { describe, expect, it } from "vitest";
import { runElisaConcentration } from "./tool.js";

describe("ELISA Linear Standard Curve", () => {
  it("calculates a valid result", () =>
    expect(
      runElisaConcentration({ absorbance: 1.5, intercept: 0.5, slope: 0.5 }),
    ).toEqual({
      ok: true,
      output: { concentrationNgMl: 2 },
    }));
  it("returns zero concentration at the intercept", () =>
    expect(
      runElisaConcentration({ absorbance: 0.3, intercept: 0.3, slope: 1 }),
    ).toEqual({
      ok: true,
      output: { concentrationNgMl: 0 },
    }));
  it("may return negative concentrations", () =>
    expect(
      runElisaConcentration({ absorbance: 0.1, intercept: 0.6, slope: 0.5 }),
    ).toEqual({
      ok: true,
      output: { concentrationNgMl: -1 },
    }));
  it("scales inversely with the slope", () => {
    const result = runElisaConcentration({
      absorbance: 2,
      intercept: 0,
      slope: 2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.concentrationNgMl).toBe(1);
  });
  it("accepts negative intercepts", () =>
    expect(
      runElisaConcentration({ absorbance: 1, intercept: -1, slope: 1 }),
    ).toEqual({
      ok: true,
      output: { concentrationNgMl: 2 },
    }));
  it("rejects zero slope", () => {
    const result = runElisaConcentration({
      absorbance: 1,
      intercept: 0,
      slope: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_slope");
  });
  it("rejects negative slope", () =>
    expect(
      runElisaConcentration({ absorbance: 1, intercept: 0, slope: -2 }).ok,
    ).toBe(false));
  it("rejects non-finite absorbance", () =>
    expect(
      runElisaConcentration({
        absorbance: Number.POSITIVE_INFINITY,
        intercept: 0,
        slope: 1,
      }).ok,
    ).toBe(false));
});
