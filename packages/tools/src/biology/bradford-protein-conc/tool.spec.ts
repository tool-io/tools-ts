import { describe, expect, it } from "vitest";
import { runBradfordProteinConc } from "./tool.js";

describe("Bradford Protein Conc", () => {
  it("calculates a valid result", () =>
    expect(
      runBradfordProteinConc({ absorbance595: 0.4, calibrationSlope: 0.02 }),
    ).toEqual({
      ok: true,
      output: { proteinUgPerMl: 20 },
    }));
  it("returns zero for a blank well", () =>
    expect(
      runBradfordProteinConc({ absorbance595: 0, calibrationSlope: 0.02 }),
    ).toEqual({
      ok: true,
      output: { proteinUgPerMl: 0 },
    }));
  it("supports steep standard curves", () =>
    expect(
      runBradfordProteinConc({ absorbance595: 0.75, calibrationSlope: 0.03 }),
    ).toEqual({
      ok: true,
      output: { proteinUgPerMl: 25 },
    }));
  it("rejects a zero slope", () =>
    expect(
      runBradfordProteinConc({ absorbance595: 0.4, calibrationSlope: 0 }).ok,
    ).toBe(false));
  it("rejects negative slopes", () =>
    expect(
      runBradfordProteinConc({ absorbance595: 0.4, calibrationSlope: -0.02 })
        .ok,
    ).toBe(false));
  it("rejects negative absorbance", () =>
    expect(
      runBradfordProteinConc({ absorbance595: -0.4, calibrationSlope: 0.02 })
        .ok,
    ).toBe(false));
});
