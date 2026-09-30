import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a12: number;
  readonly a21: number;
  readonly b12: number;
  readonly b21: number;
};
export type Output = { readonly first: number; readonly second: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a12: { type: "number" },
    a21: { type: "number" },
    b12: { type: "number" },
    b21: { type: "number" },
  },
  required: ["a12", "a21", "b12", "b21"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
/** Calculate matrix 2x2 commutator diagonal entry from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a12, a21, b12, b21 } = input;
  const compute = (): Output => {
    const first = a12 * b21 - b12 * a21;
    return { first, second: -first };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a12: 2, a21: 3, b12: 4, b21: 5 },
  output: { first: -2, second: 2 },
} satisfies ToolExample<Input, Output>;
export const matrix2x2CommutatorDiagonalEntryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-2x2-commutator-diagonal-entry",
    title: "Matrix 2x2 Commutator Diagonal Entry Tool",
    description:
      "Calculate matrix 2x2 commutator diagonal entry from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a12: { type: "number" },
        a21: { type: "number" },
        b12: { type: "number" },
        b21: { type: "number" },
      },
      required: ["a12", "a21", "b12", "b21"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "number" }, second: { type: "number" } },
      required: ["first", "second"],
    },
    ports: {
      inputs: [
        {
          id: "a12",
          label: "A12",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "a21",
          label: "A21",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "b12",
          label: "B12",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "b21",
          label: "B21",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "first", label: "First", valueType: { type: "number" } },
        { id: "second", label: "Second", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = matrix2x2CommutatorDiagonalEntryTool.execute;
export default matrix2x2CommutatorDiagonalEntryTool;
