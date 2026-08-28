import { describe, expect, it } from "vitest";
import { runIsotopicAbundance } from "./tool.js";

describe("Isotopic Abundance Calculator", () => {
  it("calculates a valid result for boron", () => {
    const result = runIsotopicAbundance({
      averageMassU: 10.811,
      isotopeMass1U: 10.012937,
      isotopeMass2U: 11.009305,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.isotope1Percent).toBeCloseTo(19.9, 1);
    expect(result.output.isotope2Percent).toBeCloseTo(80.1, 1);
  });

  it("rejects equal isotope masses through execution", () => {
    expect(
      runIsotopicAbundance({
        averageMassU: 11,
        isotopeMass1U: 11,
        isotopeMass2U: 11,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_isotope_masses" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runIsotopicAbundance(null).ok).toBe(false));
});
