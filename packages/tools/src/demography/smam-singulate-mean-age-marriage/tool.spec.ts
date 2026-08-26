import { describe, expect, it } from "vitest";
import {
  calculateSmamSingulateMeanAgeMarriage,
  runSmamSingulateMeanAgeMarriage,
  smamSingulateMeanAgeMarriageExample,
} from "./tool.js";

describe("smam-singulate-mean-age-marriage", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSmamSingulateMeanAgeMarriage(
        smamSingulateMeanAgeMarriageExample.input,
      ),
    ).toEqual({
      ok: true,
      output: smamSingulateMeanAgeMarriageExample.output,
    });
  });

  it("gives a higher SMAM for later marriage", () => {
    const early = calculateSmamSingulateMeanAgeMarriage({
      proportionSingle: [0.8, 0.4, 0.15, 0.05, 0.02, 0.01, 0.005],
    });
    const late = calculateSmamSingulateMeanAgeMarriage({
      proportionSingle: [0.95, 0.75, 0.45, 0.2, 0.08, 0.03, 0.01],
    });
    expect(late.smamYears).toBeGreaterThan(early.smamYears);
  });

  it("rejects proportions outside the unit interval", () => {
    expect(
      runSmamSingulateMeanAgeMarriage({
        proportionSingle: [0.9, 0.7, 1.2, 0.3, 0.2, 0.1, 0.05],
      }).ok,
    ).toBe(false);
  });

  it("rejects an all-single schedule", () => {
    expect(
      runSmamSingulateMeanAgeMarriage({
        proportionSingle: [1, 1, 1, 1, 1, 1, 1],
      }).ok,
    ).toBe(false);
  });

  it("requires all seven five-year groups through ages 45-49", () => {
    expect(
      runSmamSingulateMeanAgeMarriage({ proportionSingle: [0.8, 0.4] }).ok,
    ).toBe(false);
  });
});
