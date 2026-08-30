import { describe, expect, it } from "vitest";
import {
  buildScenarioQuadrants,
  runScenarioQuadrant,
  scenarioQuadrantExample,
} from "./tool.js";

describe("scenario two-axis quadrant builder", () => {
  it("reproduces its canonical example", () => {
    expect(runScenarioQuadrant(scenarioQuadrantExample.input)).toEqual({
      ok: true,
      output: scenarioQuadrantExample.output,
    });
  });

  it("assigns midpoint values to the high quadrants", () => {
    expect(
      buildScenarioQuadrants({
        scenarioIds: ["A", "B", "C", "D"],
        xMidpoint: 0,
        xValues: [0, 0, -1, 1],
        yMidpoint: 0,
        yValues: [0, -1, 0, -1],
      }).quadrantCounts,
    ).toEqual([1, 2, 1, 0]);
  });

  it("keeps scenario IDs in the assignments", () => {
    expect(
      buildScenarioQuadrants({
        scenarioIds: ["Policy"],
        xMidpoint: 0,
        xValues: [1],
        yMidpoint: 0,
        yValues: [1],
      }).assignments,
    ).toEqual(["Policy: Q1"]);
  });

  it("rejects mismatched scenario arrays", () => {
    expect(
      runScenarioQuadrant({
        scenarioIds: ["A"],
        xMidpoint: 0,
        xValues: [],
        yMidpoint: 0,
        yValues: [1],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "scenario_data_length_mismatch", field: "xValues" }],
      },
      ok: false,
    });
  });
});
