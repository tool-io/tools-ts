import { describe, expect, it } from "vitest";
import { runIsotopeAverageMass } from "./tool.js";

describe("Isotope Average Mass Calculator", () => {
  it("calculates a valid result for chlorine", () => {
    expect(
      runIsotopeAverageMass({
        abundancesPercent: [75.77, 24.23],
        isotopeMassesU: [34.968852682, 36.965902602],
      }),
    ).toEqual({
      ok: true,
      output: { averageMassU: expect.closeTo(35.453, 3) },
    });
  });

  it("rejects mismatched list lengths through execution", () => {
    expect(
      runIsotopeAverageMass({
        abundancesPercent: [50],
        isotopeMassesU: [34.97, 36.97],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_lengths" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runIsotopeAverageMass(null).ok).toBe(false));
});
