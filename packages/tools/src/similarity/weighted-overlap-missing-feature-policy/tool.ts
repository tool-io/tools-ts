import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: readonly number[];
  readonly right: readonly number[];
  readonly weights: readonly number[];
  readonly missingValue: number;
};
export type Output = { readonly overlap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "array", maxItems: 256, items: { type: "number" } },
    right: { type: "array", maxItems: 256, items: { type: "number" } },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    missingValue: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["left", "right", "weights", "missingValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" } },
  required: ["overlap"],
} as const;
/** Compute weighted overlap missing feature policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, weights, missingValue } = input;
  const compute = (): Output => {
    sameLength(left, right);
    sameLength(left, weights);
    probability(missingValue);
    domain(
      weights.every((x) => x >= 0) &&
        left.every((x) => x === -1 || x >= 0) &&
        right.every((x) => x === -1 || x >= 0),
    );
    return {
      overlap: left.reduce(
        (s, x, i) =>
          s +
          weights[i] *
            Math.min(
              x === -1 ? missingValue : x,
              right[i] === -1 ? missingValue : right[i],
            ),
        0,
      ),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: [-1, 1], right: [1, 1], weights: [2, 1], missingValue: 0 },
  output: { overlap: 1 },
} satisfies ToolExample<Input, Output>;
export const weightedOverlapMissingFeaturePolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/weighted-overlap-missing-feature-policy",
  title: "Weighted Overlap Missing Feature Policy Tool",
  description:
    "Compute weighted overlap missing feature policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "weights",
        label: "Weights",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "missingValue",
        label: "Missing Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "overlap", label: "Overlap", valueType: { type: "number" } },
    ],
  },
});
export const run = weightedOverlapMissingFeaturePolicyTool.execute;
export default weightedOverlapMissingFeaturePolicyTool;
