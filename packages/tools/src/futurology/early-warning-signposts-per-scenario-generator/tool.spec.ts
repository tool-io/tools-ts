import { describe, expect, it } from "vitest";
import {
  generateScenarioEarlyWarningSignposts,
  runScenarioSignposts,
  scenarioSignpostExample,
} from "./tool.js";

describe("early-warning signposts per scenario generator", () => {
  it("reproduces its canonical example", () => {
    expect(runScenarioSignposts(scenarioSignpostExample.input)).toEqual({
      ok: true,
      output: scenarioSignpostExample.output,
    });
  });

  it("reports uncovered scenarios", () => {
    expect(
      generateScenarioEarlyWarningSignposts({
        scenarioIds: ["A", "B"],
        scenarioSignposts: ["A|indicator|threshold|horizon"],
      }).uncoveredScenarioIds,
    ).toEqual(["B"]);
  });

  it("allows a signpost to contain extra pipe-delimited detail", () => {
    expect(
      generateScenarioEarlyWarningSignposts({
        scenarioIds: ["A"],
        scenarioSignposts: ["A|indicator|value|by date|note"],
      }).totalSignpostCount,
    ).toBe(1);
  });

  it("rejects a signpost for an unknown scenario", () => {
    expect(
      runScenarioSignposts({
        scenarioIds: ["A"],
        scenarioSignposts: ["B|indicator|threshold|horizon"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_scenario_signpost", field: "scenarioSignposts.0" },
        ],
      },
      ok: false,
    });
  });
});
