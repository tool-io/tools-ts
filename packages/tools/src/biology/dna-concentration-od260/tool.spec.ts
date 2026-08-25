import { describe, expect, it } from "vitest";
import { runDnaConcentrationOd260 } from "./tool.js";

describe("DNA Conc From A260", () => {
  it("calculates a valid result", () =>
    expect(
      runDnaConcentrationOd260({ absorbance260: 0.5, dilutionFactor: 2 }),
    ).toEqual({
      ok: true,
      output: { dnaConcentrationNgUl: 50 },
    }));
  it("defaults the dilution factor to one", () =>
    expect(runDnaConcentrationOd260({ absorbance260: 0.5 })).toEqual({
      ok: true,
      output: { dnaConcentrationNgUl: 25 },
    }));
  it("returns zero for a blank well", () =>
    expect(runDnaConcentrationOd260({ absorbance260: 0 })).toEqual({
      ok: true,
      output: { dnaConcentrationNgUl: 0 },
    }));
  it("rejects negative absorbance", () =>
    expect(runDnaConcentrationOd260({ absorbance260: -0.5 }).ok).toBe(false));
  it("rejects dilution factors below one", () =>
    expect(
      runDnaConcentrationOd260({ absorbance260: 0.5, dilutionFactor: 0.5 }).ok,
    ).toBe(false));
});
