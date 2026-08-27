import { describe, expect, it } from "vitest";
import { runSelectionIntensityI } from "./tool.js";

describe("Selection Intensity i", () => {
  it("divides the selection difference by the phenotypic SD", () =>
    expect(
      runSelectionIntensityI({
        phenotypicStandardDeviation: 4,
        selectionDifferenceS: 2,
      }),
    ).toEqual({ ok: true, output: { selectionIntensityI: 0.5 } }));
  it("returns a negative intensity for selection below the mean", () =>
    expect(
      runSelectionIntensityI({
        phenotypicStandardDeviation: 2,
        selectionDifferenceS: -3,
      }),
    ).toEqual({ ok: true, output: { selectionIntensityI: -1.5 } }));
  it("yields zero for no selection difference", () =>
    expect(
      runSelectionIntensityI({
        phenotypicStandardDeviation: 8,
        selectionDifferenceS: 0,
      }),
    ).toEqual({ ok: true, output: { selectionIntensityI: 0 } }));
  it("yields unit intensity when the difference equals the SD", () =>
    expect(
      runSelectionIntensityI({
        phenotypicStandardDeviation: 5.5,
        selectionDifferenceS: 5.5,
      }),
    ).toEqual({ ok: true, output: { selectionIntensityI: 1 } }));
  it("rejects a non-positive standard deviation", () => {
    const result = runSelectionIntensityI({
      phenotypicStandardDeviation: 0,
      selectionDifferenceS: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects a negative standard deviation", () => {
    const result = runSelectionIntensityI({
      phenotypicStandardDeviation: -1,
      selectionDifferenceS: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("phenotypicStandardDeviation");
  });
});
