import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointProbability: number;
  readonly conditioningProbability: number;
};
export type Output = { readonly conditionalProbability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointProbability: { type: "number", minimum: 0, maximum: 1 },
    conditioningProbability: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
    },
  },
  required: ["jointProbability", "conditioningProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conditionalProbability: { type: "number" } },
  required: ["conditionalProbability"],
} as const;
/** Return P(A and B)/P(B), requiring a positive conditioning probability and a compatible joint probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointProbability, conditioningProbability } = request;
  const compute = (): Output => {
    (H.domain(
      jointProbability >= 0 && jointProbability <= 1,
      "jointProbability",
    ),
      jointProbability);
    H.domain(
      conditioningProbability > 0 &&
        conditioningProbability <= 1 &&
        jointProbability <= conditioningProbability,
      "conditioningProbability",
    );
    return {
      conditionalProbability: jointProbability / conditioningProbability,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jointProbability: 0.15, conditioningProbability: 0.6 },
  output: { conditionalProbability: 0.25 },
} satisfies ToolExample<Input, Output>;
export const conditionalProbabilityDenominatorCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/conditional-probability-denominator-check",
      title: "Conditional Probability Denominator Check Tool",
      description:
        "Return P(A and B)/P(B), requiring a positive conditioning probability and a compatible joint probability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          jointProbability: { type: "number", minimum: 0, maximum: 1 },
          conditioningProbability: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
        },
        required: ["jointProbability", "conditioningProbability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalProbability: { type: "number" } },
        required: ["conditionalProbability"],
      },
      ports: {
        inputs: [
          {
            id: "jointProbability",
            label: "Joint Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conditioningProbability",
            label: "Conditioning Probability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conditionalProbability",
            label: "Conditional Probability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conditionalProbabilityDenominatorCheckTool.execute;
export default conditionalProbabilityDenominatorCheckTool;
