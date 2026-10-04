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
/** Calculate vector affine combination weight residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { weights } = input;
  const compute = (): Output => {
    const sum = weights.reduce((a, b) => a + b, 0);
    return { sum, residual: sum - 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weights: [0.2, 0.3, 0.4] },
  output: { sum: 0.9, residual: -0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const vectorAffineCombinationWeightResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-affine-combination-weight-residual",
      title: "Vector Affine Combination Weight Residual Tool",
      description:
        "Calculate vector affine combination weight residual from explicit caller-supplied inputs.",
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
export const run = vectorAffineCombinationWeightResidualTool.execute;
export default vectorAffineCombinationWeightResidualTool;
