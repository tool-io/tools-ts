import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ij: number; readonly ji: number };
export type Output = { readonly symmetric: number; readonly skew: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ij: { type: "number" }, ji: { type: "number" } },
  required: ["ij", "ji"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symmetric: { type: "number" }, skew: { type: "number" } },
  required: ["symmetric", "skew"],
} as const;
/** Calculate matrix symmetric skew entry split from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { ij, ji } = input;
  const compute = (): Output => {
    return { symmetric: ij / 2 + ji / 2, skew: ij / 2 - ji / 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { ij: 3, ji: 7 },
  output: { symmetric: 5, skew: -2 },
} satisfies ToolExample<Input, Output>;
export const matrixSymmetricSkewEntrySplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-symmetric-skew-entry-split",
    title: "Matrix Symmetric Skew Entry Split Tool",
    description:
      "Calculate matrix symmetric skew entry split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ij: { type: "number" }, ji: { type: "number" } },
      required: ["ij", "ji"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symmetric: { type: "number" }, skew: { type: "number" } },
      required: ["symmetric", "skew"],
    },
    ports: {
      inputs: [
        {
          id: "ij",
          label: "Ij",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ji",
          label: "Ji",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "symmetric", label: "Symmetric", valueType: { type: "number" } },
        { id: "skew", label: "Skew", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = matrixSymmetricSkewEntrySplitTool.execute;
export default matrixSymmetricSkewEntrySplitTool;
