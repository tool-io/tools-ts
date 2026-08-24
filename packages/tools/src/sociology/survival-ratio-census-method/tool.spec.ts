import { describe, expect, it } from "vitest";
import {
  calculateSurvivalRatio,
  survivalRatioCensusMethodExample,
  survivalRatioCensusMethodTool,
  runSurvivalRatioCensusMethod,
} from "./tool.js";

describe("survivalRatioCensusMethodTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSurvivalRatioCensusMethod(survivalRatioCensusMethodExample.input),
    ).toEqual({
      ok: true,
      output: survivalRatioCensusMethodExample.output,
    });
  });

  it("divides the later cohort count by the earlier count", () => {
    expect(
      calculateSurvivalRatio({
        populationAgeXCohort: 400,
        populationFiveYearsLater: 300,
      }),
    ).toEqual({ survivalRatio: 0.75 });
    const result = runSurvivalRatioCensusMethod({
      populationAgeXCohort: 0,
      populationFiveYearsLater: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("populationAgeXCohort");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(survivalRatioCensusMethodExample)),
    ).toEqual(survivalRatioCensusMethodExample);
    expect(survivalRatioCensusMethodTool.contractVersion).toBe(1);
    expect(survivalRatioCensusMethodTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSurvivalRatioCensusMethod(null).ok).toBe(false);
    expect(
      runSurvivalRatioCensusMethod({
        ...survivalRatioCensusMethodExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
