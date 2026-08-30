import { describe, expect, it } from "vitest";
import {
  buildOfficialFutureShadowScenarioSet,
  futureShadowSetExample,
  runFutureShadowSet,
} from "./tool.js";

describe("official future shadow scenario set builder", () => {
  it("reproduces its canonical example", () => {
    expect(runFutureShadowSet(futureShadowSetExample.input)).toEqual({
      ok: true,
      output: futureShadowSetExample.output,
    });
  });

  it("labels one shadow scenario in the singular", () => {
    expect(
      buildOfficialFutureShadowScenarioSet({
        primaryScenario: "Primary",
        shadowScenarios: ["Shadow"],
      }).setNarrative,
    ).toContain("1 shadow scenario selected");
  });

  it("builds coherence checks for every shadow", () => {
    expect(
      buildOfficialFutureShadowScenarioSet({
        primaryScenario: "Primary",
        shadowScenarios: ["A", "B", "C"],
      }).consistencyChecks,
    ).toHaveLength(3);
  });

  it("rejects a duplicate primary scenario", () => {
    expect(
      runFutureShadowSet({
        primaryScenario: "Same",
        shadowScenarios: ["Same"],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "duplicate_scenario", field: "shadowScenarios" }],
      },
      ok: false,
    });
  });
});
