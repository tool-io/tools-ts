import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = { readonly residual: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
    d: { type: "number" },
  },
  required: ["a", "b", "c", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["residual"],
} as const;
/** Calculate matrix 2x2 cayley hamilton residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c, d } = input;
  const compute = (): Output => {
    const t = a + d,
      det = a * d - b * c;
    return {
      residual: [
        a * a + b * c - t * a + det,
        a * b + b * d - t * b,
        c * a + d * c - t * c,
        c * b + d * d - t * d + det,
      ],
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 1, b: 2, c: 3, d: 4 },
  output: { residual: [0, 0, 0, 0] },
} satisfies ToolExample<Input, Output>;
export const matrix2x2CayleyHamiltonResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-2x2-cayley-hamilton-residual",
    title: "Matrix 2x2 Cayley Hamilton Residual Tool",
    description:
      "Calculate matrix 2x2 cayley hamilton residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" },
        d: { type: "number" },
      },
      required: ["a", "b", "c", "d"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["residual"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        { id: "d", label: "D", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "residual",
          label: "Residual",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = matrix2x2CayleyHamiltonResidualTool.execute;
export default matrix2x2CayleyHamiltonResidualTool;
