import { describe, expect, it } from "vitest";
import {
  calculateIndirectStandardizedSmr,
  runIndirectStandardizedSmr,
  indirectStandardizedSmrExample,
} from "./tool.js";

describe("demography/indirect-standardized-smr", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIndirectStandardizedSmr(indirectStandardizedSmrExample.input),
    ).toEqual({ ok: true, output: indirectStandardizedSmrExample.output });
  });

  it("returns an SMR of one when observed matches expected", () => {
    const result = calculateIndirectStandardizedSmr({
      standardRates: [0.01, 0.03],
      studyPopulationByAge: [1000, 1000],
      observedDeathsTotal: 40,
      standardCrudeRate: 0.02,
    });
    expect(result.expectedDeaths).toBe(40);
    expect(result.smr).toBe(1);
    expect(result.indirectlyStandardizedRate).toBe(0.02);
  });

  it("rejects empty exposure and impossible expected deaths", () => {
    expect(
      runIndirectStandardizedSmr({
        standardRates: [0.01],
        studyPopulationByAge: [],
        observedDeathsTotal: 0,
        standardCrudeRate: 0.02,
      }).ok,
    ).toBe(false);
    expect(
      runIndirectStandardizedSmr({
        standardRates: [0, 0],
        studyPopulationByAge: [10, 10],
        observedDeathsTotal: 1,
        standardCrudeRate: 0.02,
      }).ok,
    ).toBe(false);
  });

  it("uses the standard crude rate rather than the study crude rate", () => {
    const result = calculateIndirectStandardizedSmr({
      standardRates: [0.01],
      studyPopulationByAge: [1000],
      observedDeathsTotal: 20,
      standardCrudeRate: 0.03,
    });
    expect(result.smr).toBe(2);
    expect(result.crudeMortalityRate).toBe(0.02);
    expect(result.indirectlyStandardizedRate).toBe(0.06);
  });
});
