import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opportunityValue: number;
  readonly winProbability: number;
  readonly realizationFraction: number;
  readonly costToClose: number;
};
export type Output = {
  readonly weightedRevenue: number;
  readonly weightedNet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunityValue: { type: "number", minimum: 0 },
    winProbability: { type: "number", minimum: 0, maximum: 1 },
    realizationFraction: { type: "number", minimum: 0, maximum: 1 },
    costToClose: { type: "number", minimum: 0 },
  },
  required: [
    "opportunityValue",
    "winProbability",
    "realizationFraction",
    "costToClose",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedRevenue: { type: "number" },
    weightedNet: { type: "number" },
  },
  required: ["weightedRevenue", "weightedNet"],
} as const;
/** Calculate sales pipeline one stage probability weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opportunityValue, winProbability, realizationFraction, costToClose } =
    request;
  const compute = (): Output => {
    H.domain(opportunityValue >= 0 && costToClose >= 0);
    H.probability(winProbability);
    H.probability(realizationFraction);
    return {
      weightedRevenue: opportunityValue * winProbability * realizationFraction,
      weightedNet:
        opportunityValue * winProbability * realizationFraction - costToClose,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opportunityValue: 10000,
    winProbability: 0.3,
    realizationFraction: 0.8,
    costToClose: 500,
  },
  output: { weightedRevenue: 2400, weightedNet: 1900 },
} satisfies ToolExample<Input, Output>;
export const salesPipelineOneStageProbabilityWeightTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/sales-pipeline-one-stage-probability-weight",
      title: "Sales Pipeline One Stage Probability Weight Tool",
      description:
        "Calculate sales pipeline one stage probability weight from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opportunityValue: { type: "number", minimum: 0 },
          winProbability: { type: "number", minimum: 0, maximum: 1 },
          realizationFraction: { type: "number", minimum: 0, maximum: 1 },
          costToClose: { type: "number", minimum: 0 },
        },
        required: [
          "opportunityValue",
          "winProbability",
          "realizationFraction",
          "costToClose",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedRevenue: { type: "number" },
          weightedNet: { type: "number" },
        },
        required: ["weightedRevenue", "weightedNet"],
      },
      ports: {
        inputs: [
          {
            id: "opportunityValue",
            label: "Opportunity Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "winProbability",
            label: "Win Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "realizationFraction",
            label: "Realization Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "costToClose",
            label: "Cost To Close",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightedRevenue",
            label: "Weighted Revenue",
            valueType: { type: "number" },
          },
          {
            id: "weightedNet",
            label: "Weighted Net",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = salesPipelineOneStageProbabilityWeightTool.execute;
export default salesPipelineOneStageProbabilityWeightTool;
