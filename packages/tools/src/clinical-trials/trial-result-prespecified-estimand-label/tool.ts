import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultLabel: string;
  readonly prespecifiedLabels: readonly string[];
  readonly population: string;
  readonly prespecifiedPopulation: string;
  readonly intercurrentStrategy: string;
  readonly expectedStrategy: string;
};
export type Output = {
  readonly labelListed: boolean;
  readonly populationMatches: boolean;
  readonly strategyMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultLabel: { type: "string", maxLength: 8192 },
    prespecifiedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    population: { type: "string", maxLength: 8192 },
    prespecifiedPopulation: { type: "string", maxLength: 8192 },
    intercurrentStrategy: { type: "string", maxLength: 8192 },
    expectedStrategy: { type: "string", maxLength: 8192 },
  },
  required: [
    "resultLabel",
    "prespecifiedLabels",
    "population",
    "prespecifiedPopulation",
    "intercurrentStrategy",
    "expectedStrategy",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelListed: { type: "boolean" },
    populationMatches: { type: "boolean" },
    strategyMatches: { type: "boolean" },
  },
  required: ["labelListed", "populationMatches", "strategyMatches"],
} as const;
/** Audit supplied estimand labels and metadata without deriving an estimand. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    resultLabel,
    prespecifiedLabels,
    population,
    prespecifiedPopulation,
    intercurrentStrategy,
    expectedStrategy,
  } = request;
  const compute = (): Output => {
    return {
      labelListed: prespecifiedLabels.includes(resultLabel),
      populationMatches: population === prespecifiedPopulation,
      strategyMatches: intercurrentStrategy === expectedStrategy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultLabel: "E1",
    prespecifiedLabels: ["E1"],
    population: "P1",
    prespecifiedPopulation: "P1",
    intercurrentStrategy: "strategy-A",
    expectedStrategy: "strategy-A",
  },
  output: { labelListed: true, populationMatches: true, strategyMatches: true },
} satisfies ToolExample<Input, Output>;
export const trialResultPrespecifiedEstimandLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-trials/trial-result-prespecified-estimand-label",
      title: "Trial Result Prespecified Estimand Label Tool",
      description:
        "Audit supplied estimand labels and metadata without deriving an estimand.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resultLabel: { type: "string", maxLength: 8192 },
          prespecifiedLabels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          population: { type: "string", maxLength: 8192 },
          prespecifiedPopulation: { type: "string", maxLength: 8192 },
          intercurrentStrategy: { type: "string", maxLength: 8192 },
          expectedStrategy: { type: "string", maxLength: 8192 },
        },
        required: [
          "resultLabel",
          "prespecifiedLabels",
          "population",
          "prespecifiedPopulation",
          "intercurrentStrategy",
          "expectedStrategy",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          labelListed: { type: "boolean" },
          populationMatches: { type: "boolean" },
          strategyMatches: { type: "boolean" },
        },
        required: ["labelListed", "populationMatches", "strategyMatches"],
      },
      ports: {
        inputs: [
          {
            id: "resultLabel",
            label: "Result Label",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "prespecifiedLabels",
            label: "Prespecified Labels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "population",
            label: "Population",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "prespecifiedPopulation",
            label: "Prespecified Population",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "intercurrentStrategy",
            label: "Intercurrent Strategy",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedStrategy",
            label: "Expected Strategy",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "labelListed",
            label: "Label Listed",
            valueType: { type: "boolean" },
          },
          {
            id: "populationMatches",
            label: "Population Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "strategyMatches",
            label: "Strategy Matches",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trialResultPrespecifiedEstimandLabelTool.execute;
export default trialResultPrespecifiedEstimandLabelTool;
