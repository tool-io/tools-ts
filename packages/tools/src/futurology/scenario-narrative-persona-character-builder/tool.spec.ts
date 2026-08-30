import { describe, expect, it } from "vitest";
import {
  buildScenarioNarrativePersona,
  runScenarioPersona,
  scenarioPersonaExample,
} from "./tool.js";

describe("scenario narrative persona builder", () => {
  it("reproduces its canonical example", () => {
    expect(runScenarioPersona(scenarioPersonaExample.input)).toEqual({
      ok: true,
      output: scenarioPersonaExample.output,
    });
  });

  it("trims narrative fields", () => {
    expect(
      buildScenarioNarrativePersona({
        decisionBias: " cautious ",
        goal: " protect supply ",
        name: " Lee ",
        role: " operator ",
        scenarioContext: " demand is volatile ",
        worldConstraint: " capacity is fixed ",
      }).narrative,
    ).toContain("Lee, a operator, must pursue protect supply");
  });

  it("returns the goal-constraint conflict", () => {
    expect(
      buildScenarioNarrativePersona({
        decisionBias: "analytical",
        goal: "A",
        name: "N",
        role: "R",
        scenarioContext: "C",
        worldConstraint: "W",
      }).conflictSignals,
    ).toEqual(["A versus W"]);
  });

  it("rejects an empty narrative field", () => {
    expect(
      runScenarioPersona({
        decisionBias: "analytical",
        goal: "A",
        name: " ",
        role: "R",
        scenarioContext: "C",
        worldConstraint: "W",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "narrative_field_required", field: "name" }] },
      ok: false,
    });
  });
});
