import { describe, expect, it } from "vitest";
import { runBroadSenseHeritability } from "./tool.js";

describe("Broad-Sense Heritability", () => {
  it("computes three eighths heritability", () =>
    expect(
      runBroadSenseHeritability({
        genotypicVariance: 3,
        phenotypicVariance: 8,
      }),
    ).toEqual({ ok: true, output: { broadSenseHeritability: 0.375 } }));
  it("handles small variance components", () =>
    expect(
      runBroadSenseHeritability({
        genotypicVariance: 0.4,
        phenotypicVariance: 1.6,
      }),
    ).toEqual({ ok: true, output: { broadSenseHeritability: 0.25 } }));
  it("computes fully genetic traits", () =>
    expect(
      runBroadSenseHeritability({
        genotypicVariance: 7,
        phenotypicVariance: 7,
      }),
    ).toEqual({ ok: true, output: { broadSenseHeritability: 1 } }));
  it("returns zero when no phenotypic variance is genetic", () =>
    expect(
      runBroadSenseHeritability({
        genotypicVariance: 0,
        phenotypicVariance: 8,
      }),
    ).toEqual({ ok: true, output: { broadSenseHeritability: 0 } }));
  it("rejects a zero phenotypic variance", () => {
    const result = runBroadSenseHeritability({
      genotypicVariance: 3,
      phenotypicVariance: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_variances");
  });
  it("rejects a negative genotypic variance", () => {
    const result = runBroadSenseHeritability({
      genotypicVariance: -1,
      phenotypicVariance: 8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_variances");
  });
  it("rejects genotypic variance exceeding phenotypic variance", () => {
    const result = runBroadSenseHeritability({
      genotypicVariance: 10,
      phenotypicVariance: 8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_variances");
  });
});
