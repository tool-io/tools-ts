import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScenarioSignpostInput = {
  readonly scenarioIds: ReadonlyArray<string>;
  readonly scenarioSignposts: ReadonlyArray<string>;
};

export type ScenarioSignpostOutput = {
  readonly signpostsByScenario: ReadonlyArray<string>;
  readonly totalSignpostCount: number;
  readonly uncoveredScenarioIds: ReadonlyArray<string>;
};

export const generateScenarioEarlyWarningSignposts = (
  input: ScenarioSignpostInput,
): ScenarioSignpostOutput => {
  if (!Array.isArray(input.scenarioIds) || input.scenarioIds.length === 0)
    simpleError(
      "scenarioIds",
      "At least one scenario ID is required.",
      "scenario_ids_required",
    );
  const scenarioIds = input.scenarioIds.map((scenarioId, index) => {
    if (typeof scenarioId !== "string" || scenarioId.trim() === "")
      simpleError(
        `scenarioIds.${index}`,
        "Scenario IDs must be nonempty strings.",
        "invalid_scenario_id",
      );
    return scenarioId.trim();
  });
  if (new Set(scenarioIds).size !== scenarioIds.length)
    simpleError(
      "scenarioIds",
      "Scenario IDs must be unique.",
      "duplicate_scenario_id",
    );
  if (
    !Array.isArray(input.scenarioSignposts) ||
    input.scenarioSignposts.length === 0
  )
    simpleError(
      "scenarioSignposts",
      "At least one signpost is required.",
      "scenario_signposts_required",
    );
  const knownScenarioIds = new Set(scenarioIds);
  const signpostsByScenario: string[] = [];
  for (const [index, signpost] of input.scenarioSignposts.entries()) {
    if (typeof signpost !== "string")
      simpleError(
        `scenarioSignposts.${index}`,
        "Signposts must be strings.",
        "invalid_scenario_signpost",
      );
    const [rawScenarioId, ...parts] = signpost.split("|");
    const scenarioId = rawScenarioId?.trim();
    const details = parts.join("|").trim();
    if (
      scenarioId === "" ||
      details === "" ||
      !knownScenarioIds.has(scenarioId)
    )
      simpleError(
        `scenarioSignposts.${index}`,
        "Signposts must use known-scenario|indicator|threshold|horizon form.",
        "invalid_scenario_signpost",
      );
    signpostsByScenario.push(`${scenarioId}: ${details}`);
  }
  const coveredScenarioIds = new Set(
    signpostsByScenario.map((signpost) =>
      signpost.slice(0, signpost.indexOf(":")),
    ),
  );
  return {
    signpostsByScenario,
    totalSignpostCount: signpostsByScenario.length,
    uncoveredScenarioIds: scenarioIds.filter(
      (scenarioId) => !coveredScenarioIds.has(scenarioId),
    ),
  };
};

export const scenarioSignpostExample = {
  input: {
    scenarioIds: ["Rapid", "Stalled"],
    scenarioSignposts: [
      "Rapid|permit volume|20% increase|by 2028",
      "Rapid|prototype count|5 active|by 2027",
      "Stalled|pilot count|stays below 2|by 2029",
    ],
  },
  output: {
    signpostsByScenario: [
      "Rapid: permit volume|20% increase|by 2028",
      "Rapid: prototype count|5 active|by 2027",
      "Stalled: pilot count|stays below 2|by 2029",
    ],
    totalSignpostCount: 3,
    uncoveredScenarioIds: [],
  },
} satisfies ToolExample<ScenarioSignpostInput, ScenarioSignpostOutput>;

export const scenarioSignpostTool = createSimpleTool({
  calculate: (input) =>
    generateScenarioEarlyWarningSignposts({
      scenarioIds: input.scenarioIds as string[],
      scenarioSignposts: input.scenarioSignposts as string[],
    }),
  description:
    "Group caller-supplied early-warning signposts by scenario and report any scenario without a signpost.",
  id: "futurology/early-warning-signposts-per-scenario-generator",
  inputs: [
    { id: "scenarioIds", kind: "stringList", label: "Scenario IDs" },
    {
      description: "Entries in scenarioId|indicator|threshold|horizon form.",
      id: "scenarioSignposts",
      kind: "stringList",
      label: "Scenario signposts",
    },
  ],
  outputs: [
    {
      id: "signpostsByScenario",
      kind: "stringList",
      label: "Signposts by scenario",
    },
    {
      id: "totalSignpostCount",
      kind: "integer",
      label: "Total signposts",
      minimum: 1,
    },
    {
      id: "uncoveredScenarioIds",
      kind: "stringList",
      label: "Scenarios without signposts",
    },
  ],
  title: "Early Warning Signposts Per Scenario Generator",
});

export const runScenarioSignposts = scenarioSignpostTool.execute;
export default scenarioSignpostTool;
