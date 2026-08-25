import { describe, expect, it } from "vitest";
import { runBioequivalenceRatio } from "./tool.js";

describe("Bioequivalence Ratio", () => {
  it("calculates a valid result", () =>
    expect(
      runBioequivalenceRatio({ referenceAuc: 450, testAuc: 472.5 }),
    ).toEqual({
      ok: true,
      output: { bioequivalencePercent: 105 },
    }));
  it("returns one hundred percent for identical exposure", () =>
    expect(runBioequivalenceRatio({ referenceAuc: 88, testAuc: 88 })).toEqual({
      ok: true,
      output: { bioequivalencePercent: 100 },
    }));
  it("supports sub-one-hundred-percent ratios", () => {
    const result = runBioequivalenceRatio({ referenceAuc: 200, testAuc: 150 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.bioequivalencePercent).toBe(75);
  });
  it("supports supra-bioavailable formulations", () => {
    const result = runBioequivalenceRatio({ referenceAuc: 50, testAuc: 100 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.bioequivalencePercent).toBe(200);
  });
  it("scales linearly with the test AUC", () => {
    const result = runBioequivalenceRatio({ referenceAuc: 100, testAuc: 96 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.bioequivalencePercent).toBe(96);
  });
  it("returns zero for a zero test AUC", () =>
    expect(runBioequivalenceRatio({ referenceAuc: 100, testAuc: 0 })).toEqual({
      ok: true,
      output: { bioequivalencePercent: 0 },
    }));
  it("rejects a negative reference AUC", () => {
    const result = runBioequivalenceRatio({
      referenceAuc: -100,
      testAuc: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_reference_auc");
  });
  it("rejects non-finite inputs", () =>
    expect(
      runBioequivalenceRatio({
        referenceAuc: Number.NaN,
        testAuc: 90,
      }).ok,
    ).toBe(false));
});
