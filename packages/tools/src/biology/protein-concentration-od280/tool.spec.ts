import { describe, expect, it } from "vitest";
import { runProteinConcentrationOd280 } from "./tool.js";

describe("Protein Conc From A280", () => {
  it("calculates a valid result", () =>
    expect(
      runProteinConcentrationOd280({
        absorbance280: 0.5,
        extinctionCoefficientMgMlCm: 2,
      }),
    ).toEqual({
      ok: true,
      output: { proteinConcentrationMgMl: 0.25 },
    }));
  it("defaults coefficient and dilution to one", () =>
    expect(runProteinConcentrationOd280({ absorbance280: 0.3 })).toEqual({
      ok: true,
      output: { proteinConcentrationMgMl: 0.3 },
    }));
  it("applies the dilution factor", () =>
    expect(
      runProteinConcentrationOd280({
        absorbance280: 0.2,
        dilutionFactor: 5,
        extinctionCoefficientMgMlCm: 1,
      }),
    ).toEqual({
      ok: true,
      output: { proteinConcentrationMgMl: 1 },
    }));
  it("accounts for optical path length", () =>
    expect(
      runProteinConcentrationOd280({
        absorbance280: 0.5,
        extinctionCoefficientMgMlCm: 2,
        pathLengthCm: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { proteinConcentrationMgMl: 0.5 },
    }));
  it("rejects a zero extinction coefficient", () =>
    expect(
      runProteinConcentrationOd280({
        absorbance280: 0.3,
        extinctionCoefficientMgMlCm: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative absorbance", () =>
    expect(runProteinConcentrationOd280({ absorbance280: -0.3 }).ok).toBe(
      false,
    ));
});
