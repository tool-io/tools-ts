import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = { readonly complement: number };
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
  properties: { complement: { type: "number" } },
  required: ["complement"],
} as const;
/** Calculate matrix 2x2 schur complement scalar from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c, d } = input;
  const compute = (): Output => {
    H.domain(a !== 0);
    return { complement: d - (c * b) / a };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 3, c: 4, d: 8 },
  output: { complement: 2 },
} satisfies ToolExample<Input, Output>;
export const matrix2x2SchurComplementScalarTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-2x2-schur-complement-scalar",
    title: "Matrix 2x2 Schur Complement Scalar Tool",
    description:
      "Calculate matrix 2x2 schur complement scalar from explicit caller-supplied inputs.",
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
      properties: { complement: { type: "number" } },
      required: ["complement"],
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
          id: "complement",
          label: "Complement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrix2x2SchurComplementScalarTool.execute;
export default matrix2x2SchurComplementScalarTool;
