import { describe, expect, it } from "vitest";
import {
  determineMajorProgramSteps,
  majorProgramStepsExample,
  runMajorProgramSteps,
} from "./tool.js";

describe("program expenditure threshold screen", () => {
  it("reproduces its canonical example", () => {
    expect(runMajorProgramSteps(majorProgramStepsExample.input)).toEqual({
      ok: true,
      output: majorProgramStepsExample.output,
    });
  });

  it("does not meet the program threshold below the overall threshold", () => {
    expect(
      determineMajorProgramSteps({
        overallThreshold: 1_000_000,
        programExpenditure: 900_000,
        programThreshold: 100_000,
        totalFederalExpenditure: 900_000,
      }).programThresholdMet,
    ).toBe(false);
  });

  it("accepts values exactly at both thresholds", () => {
    expect(
      determineMajorProgramSteps({
        overallThreshold: 100,
        programExpenditure: 50,
        programThreshold: 50,
        totalFederalExpenditure: 100,
      }),
    ).toEqual({
      overallThresholdMet: true,
      programThresholdMet: true,
      programSharePercent: 50,
    });
  });

  it("rejects a zero total federal expenditure", () => {
    expect(
      runMajorProgramSteps({
        overallThreshold: 100,
        programExpenditure: 0,
        programThreshold: 10,
        totalFederalExpenditure: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "zero_total_expenditure", field: "totalFederalExpenditure" },
        ],
      },
      ok: false,
    });
  });
});
