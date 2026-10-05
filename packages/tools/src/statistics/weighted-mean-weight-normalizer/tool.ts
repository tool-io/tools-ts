import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weights: readonly number[] };
export type Output = {
  readonly normalizedWeights: readonly number[];
  readonly weightSum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    weightSum: { type: "number" },
  },
  required: ["normalizedWeights", "weightSum"],
} as const;
/** Normalize nonnegative observation weights to sum one for a weighted mean; positive finite total weight is required. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights } = request;
  const compute = (): Output => {
    weights.forEach((v) => H.domain(v >= 0, "weights"));
    const weightSum = weights.reduce((a, b) => a + b, 0);
    H.domain(weightSum > 0 && Number.isFinite(weightSum), "weights");
    return { normalizedWeights: weights.map((v) => v / weightSum), weightSum };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [2, 3, 5] },
  output: { normalizedWeights: [0.2, 0.3, 0.5], weightSum: 10 },
} satisfies ToolExample<Input, Output>;
export const weightedMeanWeightNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/weighted-mean-weight-normalizer",
    title: "Weighted Mean Weight Normalizer Tool",
    description:
      "Normalize nonnegative observation weights to sum one for a weighted mean; positive finite total weight is required.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        weightSum: { type: "number" },
      },
      required: ["normalizedWeights", "weightSum"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "normalizedWeights",
          label: "Normalized Weights",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "weightSum", label: "Weight Sum", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = weightedMeanWeightNormalizerTool.execute;
export default weightedMeanWeightNormalizerTool;
