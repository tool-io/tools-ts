import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weights: readonly number[] };
export type Output = { readonly sum: number; readonly residual: number };
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
  properties: { sum: { type: "number" }, residual: { type: "number" } },
  required: ["sum", "residual"],
} as const;
/** Measure the signed difference from unit sum without changing or constraining supplied signed weights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights } = request;
  const compute = (): Output => {
    return {
      sum: weights.reduce((a, b) => a + b, 0),
      residual: 1 - weights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [0.2, 0.3, 0.4] },
  output: { sum: 0.9, residual: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const unitSumResidualTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "normalize/unit-sum-residual",
    title: "Unit Sum Residual Tool",
    description:
      "Measure the signed difference from unit sum without changing or constraining supplied signed weights.",
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
      properties: { sum: { type: "number" }, residual: { type: "number" } },
      required: ["sum", "residual"],
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
        { id: "sum", label: "Sum", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = unitSumResidualTool.execute;
export default unitSumResidualTool;
