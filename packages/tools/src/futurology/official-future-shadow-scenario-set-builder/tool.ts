import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FutureShadowSetInput = {
  readonly primaryScenario: string;
  readonly shadowScenarios: ReadonlyArray<string>;
};

export type FutureShadowSetOutput = {
  readonly consistencyChecks: ReadonlyArray<string>;
  readonly scenarioCount: number;
  readonly scenarioLabels: ReadonlyArray<string>;
  readonly setNarrative: string;
};

export const buildOfficialFutureShadowScenarioSet = (
  input: FutureShadowSetInput,
): FutureShadowSetOutput => {
  if (
    typeof input.primaryScenario !== "string" ||
    input.primaryScenario.trim() === ""
  )
    simpleError(
      "primaryScenario",
      "A primary scenario is required.",
      "primary_scenario_required",
    );
  if (
    !Array.isArray(input.shadowScenarios) ||
    input.shadowScenarios.length === 0
  )
    simpleError(
      "shadowScenarios",
      "At least one shadow scenario is required.",
      "shadow_scenarios_required",
    );
  const shadowScenarios = input.shadowScenarios.map((scenario, index) => {
    if (typeof scenario !== "string" || scenario.trim() === "")
      simpleError(
        `shadowScenarios.${index}`,
        "Shadow scenarios must be nonempty strings.",
        "invalid_shadow_scenario",
      );
    return scenario.trim();
  });
  if (
    shadowScenarios.some(
      (scenario) => scenario === input.primaryScenario.trim(),
    )
  )
    simpleError(
      "shadowScenarios",
      "Shadow scenarios must differ from the primary scenario.",
      "duplicate_scenario",
    );
  return {
    consistencyChecks: shadowScenarios.map(
      (scenario) =>
        `Check whether '${scenario}' remains internally coherent without borrowing assumptions from '${input.primaryScenario.trim()}'.`,
    ),
    scenarioCount: shadowScenarios.length + 1,
    scenarioLabels: [
      "Primary",
      ...shadowScenarios.map((_, index) => `Shadow ${index + 1}`),
    ],
    setNarrative: `The set pairs the primary scenario, '${input.primaryScenario.trim()}', with ${shadowScenarios.length} shadow scenario${shadowScenarios.length === 1 ? "" : "s"} selected to test plausibility, coherence, and strategic response.`,
  };
};

export const futureShadowSetExample = {
  input: {
    primaryScenario: "Demand accelerates",
    shadowScenarios: ["Supply constraints persist", "Adoption stalls locally"],
  },
  output: {
    consistencyChecks: [
      "Check whether 'Supply constraints persist' remains internally coherent without borrowing assumptions from 'Demand accelerates'.",
      "Check whether 'Adoption stalls locally' remains internally coherent without borrowing assumptions from 'Demand accelerates'.",
    ],
    scenarioCount: 3,
    scenarioLabels: ["Primary", "Shadow 1", "Shadow 2"],
    setNarrative:
      "The set pairs the primary scenario, 'Demand accelerates', with 2 shadow scenarios selected to test plausibility, coherence, and strategic response.",
  },
} satisfies ToolExample<FutureShadowSetInput, FutureShadowSetOutput>;

export const futureShadowSetTool = createSimpleTool({
  calculate: (input) =>
    buildOfficialFutureShadowScenarioSet({
      primaryScenario: input.primaryScenario as string,
      shadowScenarios: input.shadowScenarios as string[],
    }),
  description:
    "Assemble a primary scenario and caller-supplied shadow scenarios into a labeled set with coherence checks.",
  id: "futurology/official-future-shadow-scenario-set-builder",
  inputs: [
    { id: "primaryScenario", kind: "string", label: "Primary scenario" },
    { id: "shadowScenarios", kind: "stringList", label: "Shadow scenarios" },
  ],
  outputs: [
    { id: "consistencyChecks", kind: "stringList", label: "Coherence checks" },
    {
      id: "scenarioCount",
      kind: "integer",
      label: "Scenario count",
      minimum: 2,
    },
    { id: "scenarioLabels", kind: "stringList", label: "Scenario labels" },
    { id: "setNarrative", kind: "string", label: "Scenario set narrative" },
  ],
  title: "Official Future Shadow Scenario Set Builder",
});

export const runFutureShadowSet = futureShadowSetTool.execute;
export default futureShadowSetTool;
