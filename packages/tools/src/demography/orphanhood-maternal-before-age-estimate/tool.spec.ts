import { describe, expect, it } from "vitest";
import {
  calculateOrphanhoodMaternalBeforeAgeEstimate,
  runOrphanhoodMaternalBeforeAgeEstimate,
  orphanhoodMaternalBeforeAgeEstimateExample,
} from "./tool.js";

describe("demography/orphanhood-maternal-before-age-estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOrphanhoodMaternalBeforeAgeEstimate(
        orphanhoodMaternalBeforeAgeEstimateExample.input,
      ),
    ).toEqual({
      ok: true,
      output: orphanhoodMaternalBeforeAgeEstimateExample.output,
    });
  });

  it("interpolates between quinquennial survival values", () => {
    const result = calculateOrphanhoodMaternalBeforeAgeEstimate({
      maternalSurvivalLm: [0.98, 0.94, 0.9, 0.86, 0.82, 0.77],
      meanMaternalAgeAtBirth: 17,
      targetChildAge: 6,
    });
    expect(result.maternalSurvivalAtMeanMaternity).toBeCloseTo(0.844, 12);
    expect(result.maternalSurvivalAtTargetAgeOfMother).toBeCloseTo(0.79, 12);
    expect(result.proportionMotherAlive).toBeCloseTo(0.79 / 0.844, 12);
  });

  it("rejects ages beyond the table and invalid survival values", () => {
    expect(
      runOrphanhoodMaternalBeforeAgeEstimate({
        maternalSurvivalLm: [0.98, 0.94],
        meanMaternalAgeAtBirth: 20,
        targetChildAge: 10,
      }).ok,
    ).toBe(false);
    expect(
      runOrphanhoodMaternalBeforeAgeEstimate({
        maternalSurvivalLm: [0.98, 1.01],
        meanMaternalAgeAtBirth: 20,
        targetChildAge: 1,
      }).ok,
    ).toBe(false);
    expect(
      runOrphanhoodMaternalBeforeAgeEstimate({
        maternalSurvivalLm: [0.9, 0.92, 0.8, 0.7, 0.6],
        meanMaternalAgeAtBirth: 10,
        targetChildAge: 5,
      }).ok,
    ).toBe(false);
  });
});
