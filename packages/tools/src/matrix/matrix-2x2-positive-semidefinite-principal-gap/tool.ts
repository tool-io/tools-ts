import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly d: number;
};
export type Output = {
  readonly determinant: number;
  readonly positiveSemidefinite: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    d: { type: "number" },
  },
  required: ["a", "b", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    determinant: { type: "number" },
    positiveSemidefinite: { type: "boolean" },
  },
  required: ["determinant", "positiveSemidefinite"],
} as const;
/** Calculate matrix 2x2 positive semidefinite principal gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, d } = input;
  const compute = (): Output => {
    const determinant = a * d - b * b;
    return {
      determinant,
      positiveSemidefinite: a >= 0 && d >= 0 && determinant >= 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 1, d: 3 },
  output: { determinant: 5, positiveSemidefinite: true },
} satisfies ToolExample<Input, Output>;
export const matrix2x2PositiveSemidefinitePrincipalGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-2x2-positive-semidefinite-principal-gap",
      title: "Matrix 2x2 Positive Semidefinite Principal Gap Tool",
      description:
        "Calculate matrix 2x2 positive semidefinite principal gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          a: { type: "number" },
          b: { type: "number" },
          d: { type: "number" },
        },
        required: ["a", "b", "d"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          determinant: { type: "number" },
          positiveSemidefinite: { type: "boolean" },
        },
        required: ["determinant", "positiveSemidefinite"],
      },
      ports: {
        inputs: [
          {
            id: "a",
            label: "A",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "b",
            label: "B",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "d",
            label: "D",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "determinant",
            label: "Determinant",
            valueType: { type: "number" },
          },
          {
            id: "positiveSemidefinite",
            label: "Positive Semidefinite",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = matrix2x2PositiveSemidefinitePrincipalGapTool.execute;
export default matrix2x2PositiveSemidefinitePrincipalGapTool;
