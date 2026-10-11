import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstProbability: number;
  readonly secondProbability: number;
};
export type Output = {
  readonly neitherProbability: number;
  readonly atLeastOneProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstProbability: { type: "number", minimum: 0, maximum: 1 },
    secondProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["firstProbability", "secondProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neitherProbability: { type: "number" },
    atLeastOneProbability: { type: "number" },
  },
  required: ["neitherProbability", "atLeastOneProbability"],
} as const;
/** Calculate neither and at-least-one probabilities from explicit independent event probabilities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstProbability, secondProbability } = request;
  const compute = (): Output => {
    (H.domain(
      firstProbability >= 0 && firstProbability <= 1,
      "firstProbability",
    ),
      firstProbability);
    (H.domain(
      secondProbability >= 0 && secondProbability <= 1,
      "secondProbability",
    ),
      secondProbability);
    return {
      neitherProbability: (1 - firstProbability) * (1 - secondProbability),
      atLeastOneProbability:
        1 - (1 - firstProbability) * (1 - secondProbability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstProbability: 0.5, secondProbability: 0.25 },
  output: { neitherProbability: 0.375, atLeastOneProbability: 0.625 },
} satisfies ToolExample<Input, Output>;
export const independentComplementProductTwoEventsTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["probability", "mathematics"],
        keywords: ["probability", "mathematics"],
      },
      id: "probability/independent-complement-product-two-events",
      title: "Independent Complement Product Two Events",
      description:
        "Calculate neither and at-least-one probabilities from explicit independent event probabilities.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstProbability: { type: "number", minimum: 0, maximum: 1 },
          secondProbability: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["firstProbability", "secondProbability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          neitherProbability: { type: "number" },
          atLeastOneProbability: { type: "number" },
        },
        required: ["neitherProbability", "atLeastOneProbability"],
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
        ],
        outputs: [
          {
            id: "neitherProbability",
            label: "Neither Probability",
            valueType: { type: "number" },
          },
          {
            id: "atLeastOneProbability",
            label: "At Least One Probability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = independentComplementProductTwoEventsTool.execute;
export default independentComplementProductTwoEventsTool;
