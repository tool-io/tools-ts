import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly comparable: readonly boolean[];
};
export type Output = {
  readonly normalizer: number;
  readonly supportedPositions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    comparable: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["weights", "comparable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizer: { type: "number" },
    supportedPositions: { type: "integer" },
  },
  required: ["normalizer", "supportedPositions"],
} as const;
/** Calculate mismatch weight normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, comparable } = request;
  const compute = (): Output => {
    H.sameLength(weights, comparable);
    H.domain(weights.every((x) => x >= 0));
    return {
      normalizer: weights.reduce((s, x, i) => s + (comparable[i] ? x : 0), 0),
      supportedPositions: comparable.filter(Boolean).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [1, 2, 3], comparable: [true, false, true] },
  output: { normalizer: 4, supportedPositions: 2 },
} satisfies ToolExample<Input, Output>;
export const mismatchWeightNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/mismatch-weight-normalizer",
    title: "Mismatch Weight Normalizer Tool",
    description:
      "Calculate mismatch weight normalizer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        comparable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["weights", "comparable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizer: { type: "number" },
        supportedPositions: { type: "integer" },
      },
      required: ["normalizer", "supportedPositions"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "comparable",
          label: "Comparable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "normalizer",
          label: "Normalizer",
          valueType: { type: "number" },
        },
        {
          id: "supportedPositions",
          label: "Supported Positions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = mismatchWeightNormalizerTool.execute;
export default mismatchWeightNormalizerTool;
