import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligiblePopulation: number;
  readonly suppliedUptakeFraction: number;
  readonly costPerAdopter: number;
};
export type Output = {
  readonly expectedAdopters: number;
  readonly expectedBudget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligiblePopulation: { type: "integer", minimum: 0 },
    suppliedUptakeFraction: { type: "number", minimum: 0, maximum: 1 },
    costPerAdopter: { type: "number" },
  },
  required: ["eligiblePopulation", "suppliedUptakeFraction", "costPerAdopter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedAdopters: { type: "number" },
    expectedBudget: { type: "number" },
  },
  required: ["expectedAdopters", "expectedBudget"],
} as const;
/** Calculate expectation-level adopters and cost using explicit uptake and unit-cost assumptions without a budget-impact model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligiblePopulation, suppliedUptakeFraction, costPerAdopter } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(eligiblePopulation) &&
        eligiblePopulation >= 0 &&
        eligiblePopulation <= Number.MAX_SAFE_INTEGER,
      "eligiblePopulation",
    ),
      eligiblePopulation);
    (H.domain(
      suppliedUptakeFraction >= 0 && suppliedUptakeFraction <= 1,
      "suppliedUptakeFraction",
    ),
      suppliedUptakeFraction);
    return {
      expectedAdopters: eligiblePopulation * suppliedUptakeFraction,
      expectedBudget:
        eligiblePopulation * suppliedUptakeFraction * costPerAdopter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligiblePopulation: 1000,
    suppliedUptakeFraction: 0.25,
    costPerAdopter: 40,
  },
  output: { expectedAdopters: 250, expectedBudget: 10000 },
} satisfies ToolExample<Input, Output>;
export const healthBudgetAdoptionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health-economics", "health economics", "economics"],
      keywords: ["health economics", "economics"],
    },
    id: "health-economics/health-budget-adoption-share",
    title: "Health Budget Adoption Share",
    description:
      "Calculate expectation-level adopters and cost using explicit uptake and unit-cost assumptions without a budget-impact model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligiblePopulation: { type: "integer", minimum: 0 },
        suppliedUptakeFraction: { type: "number", minimum: 0, maximum: 1 },
        costPerAdopter: { type: "number" },
      },
      required: [
        "eligiblePopulation",
        "suppliedUptakeFraction",
        "costPerAdopter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedAdopters: { type: "number" },
        expectedBudget: { type: "number" },
      },
      required: ["expectedAdopters", "expectedBudget"],
    },
    ports: {
      inputs: [
        {
          id: "eligiblePopulation",
          label: "Eligible Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedUptakeFraction",
          label: "Supplied Uptake Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "costPerAdopter",
          label: "Cost Per Adopter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedAdopters",
          label: "Expected Adopters",
          valueType: { type: "number" },
        },
        {
          id: "expectedBudget",
          label: "Expected Budget",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthBudgetAdoptionShareTool.execute;
export default healthBudgetAdoptionShareTool;
