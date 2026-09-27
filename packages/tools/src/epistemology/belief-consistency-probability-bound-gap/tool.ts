import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstProbability: number;
  readonly secondProbability: number;
  readonly conjunction: number;
};
export type Output = {
  readonly frechetLower: number;
  readonly frechetUpper: number;
  readonly lowerSlack: number;
  readonly upperSlack: number;
  readonly coherent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstProbability: { type: "number", minimum: 0, maximum: 1 },
    secondProbability: { type: "number", minimum: 0, maximum: 1 },
    conjunction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["firstProbability", "secondProbability", "conjunction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frechetLower: { type: "number" },
    frechetUpper: { type: "number" },
    lowerSlack: { type: "number" },
    upperSlack: { type: "number" },
    coherent: { type: "boolean" },
  },
  required: [
    "frechetLower",
    "frechetUpper",
    "lowerSlack",
    "upperSlack",
    "coherent",
  ],
} as const;
/** Fréchet bounds on one supplied conjunction probability, not a complete logical belief-system consistency check. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstProbability, secondProbability, conjunction } = request;
  const compute = (): Output => {
    H.probability(firstProbability);
    H.probability(secondProbability);
    H.probability(conjunction);
    return {
      frechetLower: Math.max(0, firstProbability + secondProbability - 1),
      frechetUpper: Math.min(firstProbability, secondProbability),
      lowerSlack:
        conjunction - Math.max(0, firstProbability + secondProbability - 1),
      upperSlack: Math.min(firstProbability, secondProbability) - conjunction,
      coherent:
        conjunction >= Math.max(0, firstProbability + secondProbability - 1) &&
        conjunction <= Math.min(firstProbability, secondProbability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstProbability: 0.6, secondProbability: 0.7, conjunction: 0.4 },
  output: {
    frechetLower: 0.2999999999999998,
    frechetUpper: 0.6,
    lowerSlack: 0.1000000000000002,
    upperSlack: 0.19999999999999996,
    coherent: true,
  },
} satisfies ToolExample<Input, Output>;
export const beliefConsistencyProbabilityBoundGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/belief-consistency-probability-bound-gap",
      title: "Belief Consistency Probability Bound Gap Tool",
      description:
        "Fréchet bounds on one supplied conjunction probability, not a complete logical belief-system consistency check.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstProbability: { type: "number", minimum: 0, maximum: 1 },
          secondProbability: { type: "number", minimum: 0, maximum: 1 },
          conjunction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["firstProbability", "secondProbability", "conjunction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frechetLower: { type: "number" },
          frechetUpper: { type: "number" },
          lowerSlack: { type: "number" },
          upperSlack: { type: "number" },
          coherent: { type: "boolean" },
        },
        required: [
          "frechetLower",
          "frechetUpper",
          "lowerSlack",
          "upperSlack",
          "coherent",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstProbability",
            label: "First Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondProbability",
            label: "Second Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conjunction",
            label: "Conjunction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "frechetLower",
            label: "Frechet Lower",
            valueType: { type: "number" },
          },
          {
            id: "frechetUpper",
            label: "Frechet Upper",
            valueType: { type: "number" },
          },
          {
            id: "lowerSlack",
            label: "Lower Slack",
            valueType: { type: "number" },
          },
          {
            id: "upperSlack",
            label: "Upper Slack",
            valueType: { type: "number" },
          },
          { id: "coherent", label: "Coherent", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = beliefConsistencyProbabilityBoundGapTool.execute;
export default beliefConsistencyProbabilityBoundGapTool;
