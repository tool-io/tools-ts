import { describe, expect, it } from "vitest";
import {
  runScenarioSorter,
  scenarioSorterExample,
  sortScenariosByPlausibility,
} from "./tool.js";

describe("probable plausible preferable scenario sorter", () => {
  it("reproduces its canonical example", () => {
    expect(runScenarioSorter(scenarioSorterExample.input)).toEqual({
      ok: true,
      output: scenarioSorterExample.output,
    });
  });

  it("selects plausibility and desirability independently", () => {
    expect(
      sortScenariosByPlausibility({
        desirabilityScores: [10, 1],
        plausibilityScores: [1, 9],
        scenarioIds: ["Preferred", "Probable"],
      }),
    ).toMatchObject({
      mostDesirableScenario: "Preferred",
      mostPlausibleScenario: "Probable",
    });
  });

  it("keeps input order for tied plausibility", () => {
    expect(
      sortScenariosByPlausibility({
        desirabilityScores: [1, 2],
        plausibilityScores: [5, 5],
        scenarioIds: ["First", "Second"],
      }).rankedByPlausibility,
    ).toEqual(["First", "Second"]);
  });

  it("rejects mismatched score arrays", () => {
    expect(
      runScenarioSorter({
        desirabilityScores: [1],
        plausibilityScores: [1, 2],
        scenarioIds: ["A"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "scenario_data_length_mismatch",
            field: "plausibilityScores",
          },
        ],
      },
      ok: false,
    });
  });
});
