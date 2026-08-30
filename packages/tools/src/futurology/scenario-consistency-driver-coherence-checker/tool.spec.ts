import { describe, expect, it } from "vitest";
import {
  checkScenarioDriverCoherence,
  runScenarioCoherence,
  scenarioCoherenceExample,
} from "./tool.js";

describe("scenario consistency driver coherence checker", () => {
  it("reproduces its canonical example", () => {
    expect(runScenarioCoherence(scenarioCoherenceExample.input)).toEqual({
      ok: true,
      output: scenarioCoherenceExample.output,
    });
  });

  it("accepts consistent driver signs", () => {
    expect(
      checkScenarioDriverCoherence({
        coherenceGroupIds: ["group", "other"],
        driverIds: ["A", "B"],
        effectSigns: [
          [1, 0],
          [-1, 1],
        ],
        outcomeIds: ["X", "Y"],
      }).coherent,
    ).toBe(true);
  });

  it("ignores zero effects when checking contradictions", () => {
    expect(
      checkScenarioDriverCoherence({
        coherenceGroupIds: ["group", "group"],
        driverIds: ["A", "B"],
        effectSigns: [[1], [0]],
        outcomeIds: ["X"],
      }).coherent,
    ).toBe(true);
  });

  it("rejects an invalid effect sign", () => {
    expect(
      runScenarioCoherence({
        coherenceGroupIds: ["group"],
        driverIds: ["A"],
        effectSigns: [[2]],
        outcomeIds: ["X"],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_effect_sign", field: "effectSigns.0.0" }],
      },
      ok: false,
    });
  });
});
