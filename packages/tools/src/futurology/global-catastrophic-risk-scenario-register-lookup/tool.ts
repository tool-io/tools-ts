import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CatastrophicRiskRegisterInput = {
  readonly riskCategory: string;
  readonly scenarioName: string;
  readonly timeHorizon: string;
};

export type CatastrophicRiskRegisterOutput = {
  readonly priorityBasis: string;
  readonly registerEntry: string;
  readonly reviewQuestions: ReadonlyArray<string>;
  readonly scenarioId: string;
};

const toScenarioId = (scenarioName: string): string =>
  scenarioName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildCatastrophicRiskRegisterEntry = (
  input: CatastrophicRiskRegisterInput,
): CatastrophicRiskRegisterOutput => {
  for (const [field, value] of [
    ["scenarioName", input.scenarioName],
    ["riskCategory", input.riskCategory],
    ["timeHorizon", input.timeHorizon],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Register fields must be nonempty strings.",
        "register_field_required",
      );
  const scenarioId = toScenarioId(input.scenarioName.trim());
  if (scenarioId === "")
    simpleError(
      "scenarioName",
      "Scenario name must contain at least one letter or number.",
      "invalid_scenario_name",
    );
  return {
    priorityBasis:
      "Rank the scenario by mechanism plausibility, scale, irreversibility, affected population, and recovery difficulty without treating any single score as decisive.",
    registerEntry: `${scenarioId} | category=${input.riskCategory.trim()} | horizon=${input.timeHorizon.trim()}`,
    reviewQuestions: [
      "What mechanism makes the scenario severe?",
      "What early indicators would change its assessment?",
      "What interventions reduce severity, spread, irreversibility, or recovery time?",
      "What dependencies could make the scenario worse under stress?",
    ],
    scenarioId,
  };
};

export const catastrophicRiskRegisterExample = {
  input: {
    riskCategory: "systemic",
    scenarioName: "Cascade Failure",
    timeHorizon: "10-30 years",
  },
  output: {
    priorityBasis:
      "Rank the scenario by mechanism plausibility, scale, irreversibility, affected population, and recovery difficulty without treating any single score as decisive.",
    registerEntry: "cascade-failure | category=systemic | horizon=10-30 years",
    reviewQuestions: [
      "What mechanism makes the scenario severe?",
      "What early indicators would change its assessment?",
      "What interventions reduce severity, spread, irreversibility, or recovery time?",
      "What dependencies could make the scenario worse under stress?",
    ],
    scenarioId: "cascade-failure",
  },
} satisfies ToolExample<
  CatastrophicRiskRegisterInput,
  CatastrophicRiskRegisterOutput
>;

export const catastrophicRiskRegisterTool = createSimpleTool({
  calculate: (input) =>
    buildCatastrophicRiskRegisterEntry({
      riskCategory: input.riskCategory as string,
      scenarioName: input.scenarioName as string,
      timeHorizon: input.timeHorizon as string,
    }),
  description:
    "Create a structured catastrophic-risk register entry and review prompts from a caller-supplied scenario, category, and horizon.",
  id: "futurology/global-catastrophic-risk-scenario-register-lookup",
  inputs: [
    { id: "riskCategory", kind: "string", label: "Risk category" },
    { id: "scenarioName", kind: "string", label: "Scenario name" },
    { id: "timeHorizon", kind: "string", label: "Time horizon" },
  ],
  outputs: [
    { id: "priorityBasis", kind: "string", label: "Priority basis" },
    { id: "registerEntry", kind: "string", label: "Register entry" },
    { id: "reviewQuestions", kind: "stringList", label: "Review questions" },
    { id: "scenarioId", kind: "string", label: "Scenario ID" },
  ],
  title: "Global Catastrophic Risk Scenario Register Lookup",
});

export const runCatastrophicRiskRegister = catastrophicRiskRegisterTool.execute;
export default catastrophicRiskRegisterTool;
