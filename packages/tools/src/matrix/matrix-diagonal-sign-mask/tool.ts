import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly matrix: readonly (readonly number[])[] };
export type Output = { readonly signs: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matrix: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["matrix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signs: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["signs"],
} as const;
/** Extract the sign of each main-diagonal entry in a nonempty square real matrix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { matrix } = request;
  const compute = (): Output => {
    H.domain(
      matrix.length > 0 && matrix.every((r) => r.length === matrix.length),
      "matrix",
    );
    return { signs: matrix.map((r, i) => Math.sign(r[i])) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    matrix: [
      [2, 1],
      [-4, -3],
    ],
  },
  output: { signs: [1, -1] },
} satisfies ToolExample<Input, Output>;
export const matrixDiagonalSignMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-diagonal-sign-mask",
    title: "Matrix Diagonal Sign Mask Tool",
    description:
      "Extract the sign of each main-diagonal entry in a nonempty square real matrix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matrix: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["matrix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signs: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["signs"],
    },
    ports: {
      inputs: [
        {
          id: "matrix",
          label: "Matrix",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
      ],
      outputs: [
        {
          id: "signs",
          label: "Signs",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixDiagonalSignMaskTool.execute;
export default matrixDiagonalSignMaskTool;
