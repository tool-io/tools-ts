import { describe, expect, it } from "vitest";
import {
  calculateDemographicDividendPhaseClassifier,
  runDemographicDividendPhaseClassifier,
  demographicDividendPhaseClassifierExample,
} from "./tool.js";

describe("demography/demographic-dividend-phase-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDemographicDividendPhaseClassifier(
        demographicDividendPhaseClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: demographicDividendPhaseClassifierExample.output,
    });
  });

  it("classifies an aged structure as post-dividend", () => {
    expect(
      calculateDemographicDividendPhaseClassifier({
        percentYoung: 13,
        percentWorking: 55,
        percentOld: 32,
      }).phase,
    ).toBe("post-dividend");
    expect(
      calculateDemographicDividendPhaseClassifier({
        percentYoung: 45,
        percentWorking: 50,
        percentOld: 5,
      }).phase,
    ).toBe("pre-dividend");
  });

  it("rejects shares that do not sum to one hundred percent", () => {
    expect(
      runDemographicDividendPhaseClassifier({
        percentYoung: 30,
        percentWorking: 60,
        percentOld: 30,
      }).ok,
    ).toBe(false);
    expect(
      runDemographicDividendPhaseClassifier({
        percentYoung: 30,
        percentWorking: 0,
        percentOld: 70,
      }).ok,
    ).toBe(false);
  });
});
