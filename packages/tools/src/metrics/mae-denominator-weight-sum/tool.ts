import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weights: readonly number[] };
export type Output = { readonly weightSum: number };
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
  properties: { weightSum: { type: "number" } },
  required: ["weightSum"],
} as const;
/** Sum nonnegative observation weights for a weighted MAE denominator, requiring positive total weight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights } = request;
  const compute = (): Output => {
    weights.forEach((v) => H.domain(v >= 0, "weights"));
    const weightSum = weights.reduce((a, b) => a + b, 0);
    H.domain(weightSum > 0 && Number.isFinite(weightSum), "weights");
    return { weightSum };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [2, 3, 5] },
  output: { weightSum: 10 },
} satisfies ToolExample<Input, Output>;
export const maeDenominatorWeightSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/mae-denominator-weight-sum",
    title: "Mae Denominator Weight Sum Tool",
    description:
      "Sum nonnegative observation weights for a weighted MAE denominator, requiring positive total weight.",
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
      properties: { weightSum: { type: "number" } },
      required: ["weightSum"],
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
        { id: "weightSum", label: "Weight Sum", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = maeDenominatorWeightSumTool.execute;
export default maeDenominatorWeightSumTool;
