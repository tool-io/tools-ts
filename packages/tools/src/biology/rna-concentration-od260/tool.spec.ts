import { describe, expect, it } from "vitest";
import { runRnaConcentrationOd260 } from "./tool.js";

describe("RNA Conc From A260", () => {
  it("calculates a valid result with the default dilution", () =>
    expect(runRnaConcentrationOd260({ absorbance260: 0.5 })).toEqual({
      ok: true,
      output: { rnaConcentrationNgUl: 20 },
    }));
  it("scales by the dilution factor", () =>
    expect(
      runRnaConcentrationOd260({ absorbance260: 0.25, dilutionFactor: 4 }),
    ).toEqual({
      ok: true,
      output: { rnaConcentrationNgUl: 40 },
    }));
  it("returns zero for a blank sample", () =>
    expect(runRnaConcentrationOd260({ absorbance260: 0 })).toEqual({
      ok: true,
      output: { rnaConcentrationNgUl: 0 },
    }));
  it("rejects negative absorbance", () =>
    expect(runRnaConcentrationOd260({ absorbance260: -1 }).ok).toBe(false));
});
