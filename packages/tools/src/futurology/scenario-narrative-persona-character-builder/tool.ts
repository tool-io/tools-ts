import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScenarioPersonaInput = {
  readonly decisionBias: string;
  readonly goal: string;
  readonly name: string;
  readonly role: string;
  readonly scenarioContext: string;
  readonly worldConstraint: string;
};

export type ScenarioPersonaOutput = {
  readonly conflictSignals: ReadonlyArray<string>;
  readonly narrative: string;
  readonly personaTraits: ReadonlyArray<string>;
};

export const buildScenarioNarrativePersona = (
  input: ScenarioPersonaInput,
): ScenarioPersonaOutput => {
  for (const [field, value] of [
    ["name", input.name],
    ["role", input.role],
    ["goal", input.goal],
    ["decisionBias", input.decisionBias],
    ["scenarioContext", input.scenarioContext],
    ["worldConstraint", input.worldConstraint],
  ] as const) {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Persona and narrative fields must be nonempty strings.",
        "narrative_field_required",
      );
  }
  const name = input.name.trim();
  const role = input.role.trim();
  const goal = input.goal.trim();
  const decisionBias = input.decisionBias.trim();
  const scenarioContext = input.scenarioContext.trim();
  const worldConstraint = input.worldConstraint.trim();
  return {
    conflictSignals: [`${goal} versus ${worldConstraint}`],
    narrative: `${name}, a ${role}, must pursue ${goal} in a future where ${scenarioContext}, even though ${worldConstraint}. Their ${decisionBias} perspective makes that trade-off decisive.`,
    personaTraits: [role, decisionBias, goal],
  };
};

export const scenarioPersonaExample = {
  input: {
    decisionBias: "risk-averse",
    goal: "protect community water access",
    name: "Maya",
    role: "regional planner",
    scenarioContext: "water allocations shift rapidly",
    worldConstraint: "budgets remain fixed",
  },
  output: {
    conflictSignals: [
      "protect community water access versus budgets remain fixed",
    ],
    narrative:
      "Maya, a regional planner, must pursue protect community water access in a future where water allocations shift rapidly, even though budgets remain fixed. Their risk-averse perspective makes that trade-off decisive.",
    personaTraits: [
      "regional planner",
      "risk-averse",
      "protect community water access",
    ],
  },
} satisfies ToolExample<ScenarioPersonaInput, ScenarioPersonaOutput>;

export const scenarioPersonaTool = createSimpleTool({
  calculate: (input) =>
    buildScenarioNarrativePersona({
      decisionBias: input.decisionBias as string,
      goal: input.goal as string,
      name: input.name as string,
      role: input.role as string,
      scenarioContext: input.scenarioContext as string,
      worldConstraint: input.worldConstraint as string,
    }),
  description:
    "Build a scenario narrative and decision-oriented traits from caller-supplied persona, goal, context, and constraint fields.",
  id: "futurology/scenario-narrative-persona-character-builder",
  inputs: [
    { id: "decisionBias", kind: "string", label: "Decision bias" },
    { id: "goal", kind: "string", label: "Goal" },
    { id: "name", kind: "string", label: "Persona name" },
    { id: "role", kind: "string", label: "Role" },
    { id: "scenarioContext", kind: "string", label: "Scenario context" },
    { id: "worldConstraint", kind: "string", label: "World constraint" },
  ],
  outputs: [
    { id: "conflictSignals", kind: "stringList", label: "Conflict signals" },
    { id: "narrative", kind: "string", label: "Scenario narrative" },
    { id: "personaTraits", kind: "stringList", label: "Persona traits" },
  ],
  title: "Scenario Narrative Persona Character Builder",
});

export const runScenarioPersona = scenarioPersonaTool.execute;
export default scenarioPersonaTool;
