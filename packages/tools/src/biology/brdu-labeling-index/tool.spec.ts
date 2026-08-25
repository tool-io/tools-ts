import { describe, expect, it } from "vitest";
import { runBrduLabelingIndex } from "./tool.js";

describe("BrdU Labeling Index", () => {
  it("calculates a valid result", () =>
    expect(
      runBrduLabelingIndex({ brduLabeledNuclei: 90, totalNuclei: 1200 }),
    ).toEqual({
      ok: true,
      output: { labelingIndexPercent: 7.5 },
    }));
  it("returns zero with no labeled nuclei", () =>
    expect(
      runBrduLabelingIndex({ brduLabeledNuclei: 0, totalNuclei: 300 }),
    ).toEqual({
      ok: true,
      output: { labelingIndexPercent: 0 },
    }));
  it("returns one hundred when all nuclei are labeled", () =>
    expect(
      runBrduLabelingIndex({ brduLabeledNuclei: 250, totalNuclei: 250 }),
    ).toEqual({
      ok: true,
      output: { labelingIndexPercent: 100 },
    }));
  it("rejects labeled nuclei exceeding the total", () => {
    const result = runBrduLabelingIndex({
      brduLabeledNuclei: 251,
      totalNuclei: 250,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runBrduLabelingIndex({
      brduLabeledNuclei: 12,
      totalNuclei: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative counts", () =>
    expect(
      runBrduLabelingIndex({ brduLabeledNuclei: -90, totalNuclei: 1200 }).ok,
    ).toBe(false));
});
