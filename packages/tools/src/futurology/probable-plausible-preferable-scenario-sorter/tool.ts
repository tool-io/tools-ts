import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScenarioSorterInput = {
  readonly desirabilityScores: ReadonlyArray<number>;
  readonly plausibilityScores: ReadonlyArray<number>;
  readonly scenarioIds: ReadonlyArray<string>;
};

export type ScenarioSorterOutput = {
  readonly mostDesirableScenario: string;
  readonly mostPlausibleScenario: string;
  readonly rankedByPlausibility: ReadonlyArray<string>;
};

export const sortScenariosByPlausibility = (
  input: ScenarioSorterInput,
): ScenarioSorterOutput => {
  if (
    !Array.isArray(input.scenarioIds) ||
    !Array.isArray(input.plausibilityScores) ||
    !Array.isArray(input.desirabilityScores) ||
    input.scenarioIds.length === 0
  )
    simpleError(
      "",
      "Scenario IDs and score arrays must be nonempty arrays.",
      "scenario_data_required",
    );
  if (
    input.scenarioIds.length !== input.plausibilityScores.length ||
    input.scenarioIds.length !== input.desirabilityScores.length
  )
    simpleError(
      "plausibilityScores",
      "Each scenario must have one plausibility and desirability score.",
      "scenario_data_length_mismatch",
    );
  const normalized = input.scenarioIds.map((id, index) => {
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `scenarioIds.${index}`,
        "Scenario IDs must be nonempty strings.",
        "invalid_scenario_id",
      );
    const plausibility = input.plausibilityScores[index]!;
    const desirability = input.desirabilityScores[index]!;
    if (!Number.isFinite(plausibility) || !Number.isFinite(desirability))
      simpleError(
        `plausibilityScores.${index}`,
        "Scenario scores must be finite.",
        "invalid_scenario_score",
      );
    return { desirability, id: id.trim(), plausibility };
  });
  const byPlausibility = [...normalized].sort(
    (left, right) => right.plausibility - left.plausibility,
  );
  const mostDesirable = [...normalized].sort(
    (left, right) => right.desirability - left.desirability,
  )[0]!;
  return {
    mostDesirableScenario: mostDesirable.id,
    mostPlausibleScenario: byPlausibility[0]!.id,
    rankedByPlausibility: byPlausibility.map((scenario) => scenario.id),
  };
};

export const scenarioSorterExample = {
  input: {
    desirabilityScores: [9, 5, 7],
    plausibilityScores: [0.8, 0.6, 0.7],
    scenarioIds: ["Rapid transition", "Stagnation", "Managed transition"],
  },
  output: {
    mostDesirableScenario: "Rapid transition",
    mostPlausibleScenario: "Rapid transition",
    rankedByPlausibility: [
      "Rapid transition",
      "Managed transition",
      "Stagnation",
    ],
  },
} satisfies ToolExample<ScenarioSorterInput, ScenarioSorterOutput>;

export const scenarioSorterTool = createSimpleTool({
  calculate: (input) =>
    sortScenariosByPlausibility({
      desirabilityScores: input.desirabilityScores as number[],
      plausibilityScores: input.plausibilityScores as number[],
      scenarioIds: input.scenarioIds as string[],
    }),
  description:
    "Rank scenarios by supplied plausibility scores and independently select the most desirable and most plausible scenario with stable tie order.",
  id: "futurology/probable-plausible-preferable-scenario-sorter",
  inputs: [
    {
      id: "desirabilityScores",
      kind: "numberList",
      label: "Desirability scores",
    },
    {
      id: "plausibilityScores",
      kind: "numberList",
      label: "Plausibility scores",
    },
    { id: "scenarioIds", kind: "stringList", label: "Scenario IDs" },
  ],
  outputs: [
    {
      id: "mostDesirableScenario",
      kind: "string",
      label: "Most desirable scenario",
    },
    {
      id: "mostPlausibleScenario",
      kind: "string",
      label: "Most plausible scenario",
    },
    {
      id: "rankedByPlausibility",
      kind: "stringList",
      label: "Plausibility ranking",
    },
  ],
  title: "Probable Plausible Preferable Scenario Sorter",
});

export const runScenarioSorter = scenarioSorterTool.execute;
export default scenarioSorterTool;
