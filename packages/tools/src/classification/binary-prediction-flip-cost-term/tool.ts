import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly falsePositiveCost: number;
  readonly falseNegativeCost: number;
  readonly positiveProbability: number;
};
export type Output = {
  readonly positiveCost: number;
  readonly negativeCost: number;
  readonly preferPositive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    falsePositiveCost: { type: "number" },
    falseNegativeCost: { type: "number" },
    positiveProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["falsePositiveCost", "falseNegativeCost", "positiveProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveCost: { type: "number" },
    negativeCost: { type: "number" },
    preferPositive: { type: "boolean" },
  },
  required: ["positiveCost", "negativeCost", "preferPositive"],
} as const;
/** Compute binary prediction flip cost term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { falsePositiveCost, falseNegativeCost, positiveProbability } = input;
  const compute = (): Output => {
    domain(falsePositiveCost >= 0 && falseNegativeCost >= 0);
    probability(positiveProbability);
    const positiveCost = falsePositiveCost * (1 - positiveProbability),
      negativeCost = falseNegativeCost * positiveProbability;
    return {
      positiveCost,
      negativeCost,
      preferPositive: positiveCost < negativeCost,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    falsePositiveCost: 2,
    falseNegativeCost: 6,
    positiveProbability: 0.5,
  },
  output: { positiveCost: 1, negativeCost: 3, preferPositive: true },
} satisfies ToolExample<Input, Output>;
export const binaryPredictionFlipCostTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/binary-prediction-flip-cost-term",
  title: "Binary Prediction Flip Cost Term Tool",
  description:
    "Compute binary prediction flip cost term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "falsePositiveCost",
        label: "False Positive Cost",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "falseNegativeCost",
        label: "False Negative Cost",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "positiveProbability",
        label: "Positive Probability",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "positiveCost",
        label: "Positive Cost",
        valueType: { type: "number" },
      },
      {
        id: "negativeCost",
        label: "Negative Cost",
        valueType: { type: "number" },
      },
      {
        id: "preferPositive",
        label: "Prefer Positive",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = binaryPredictionFlipCostTermTool.execute;
export default binaryPredictionFlipCostTermTool;
