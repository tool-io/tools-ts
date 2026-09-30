import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly size: number; readonly index: number };
export type Output = {
  readonly lowerOffset: number;
  readonly upperOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    size: { type: "integer", minimum: 1, maximum: 1000000 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["size", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerOffset: { type: "integer" },
    upperOffset: { type: "integer" },
  },
  required: ["lowerOffset", "upperOffset"],
} as const;
/** Compare diagonal offsets for row-major lower and row-major upper triangular packed storage. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { size, index } = input;
  const compute = (): Output => {
    H.integer(size, 1, 1000000);
    H.integer(index, 0, size - 1);
    return {
      lowerOffset: (index * (index + 3)) / 2,
      upperOffset: index * size - (index * (index - 1)) / 2,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { size: 4, index: 2 },
  output: { lowerOffset: 5, upperOffset: 7 },
} satisfies ToolExample<Input, Output>;
export const matrixLowerToUpperPackedDiagonalOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-lower-to-upper-packed-diagonal-offset",
      title: "Matrix Lower To Upper Packed Diagonal Offset Tool",
      description:
        "Compare diagonal offsets for row-major lower and row-major upper triangular packed storage.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          size: { type: "integer", minimum: 1, maximum: 1000000 },
          index: { type: "integer", minimum: 0 },
        },
        required: ["size", "index"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerOffset: { type: "integer" },
          upperOffset: { type: "integer" },
        },
        required: ["lowerOffset", "upperOffset"],
      },
      ports: {
        inputs: [
          {
            id: "size",
            label: "Size",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "index",
            label: "Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "lowerOffset",
            label: "Lower Offset",
            valueType: { type: "integer" },
          },
          {
            id: "upperOffset",
            label: "Upper Offset",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = matrixLowerToUpperPackedDiagonalOffsetTool.execute;
export default matrixLowerToUpperPackedDiagonalOffsetTool;
