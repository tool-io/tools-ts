import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = {
  readonly nilpotent: boolean;
  readonly trace: number;
  readonly determinant: number;
};
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
    nilpotent: { type: "boolean" },
    trace: { type: "number" },
    determinant: { type: "number" },
  },
  required: ["nilpotent", "trace", "determinant"],
} as const;
/** Calculate matrix 2x2 nilpotency trace determinant from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c, d } = input;
  const compute = (): Output => {
    const trace = a + d,
      determinant = a * d - b * c;
    return { nilpotent: trace === 0 && determinant === 0, trace, determinant };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 0, b: 3, c: 0, d: 0 },
  output: { nilpotent: true, trace: 0, determinant: 0 },
} satisfies ToolExample<Input, Output>;
export const matrix2x2NilpotencyTraceDeterminantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-2x2-nilpotency-trace-determinant",
      title: "Matrix 2x2 Nilpotency Trace Determinant Tool",
      description:
        "Calculate matrix 2x2 nilpotency trace determinant from explicit caller-supplied inputs.",
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
          nilpotent: { type: "boolean" },
          trace: { type: "number" },
          determinant: { type: "number" },
        },
        required: ["nilpotent", "trace", "determinant"],
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
            id: "c",
            label: "C",
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
            id: "nilpotent",
            label: "Nilpotent",
            valueType: { type: "boolean" },
          },
          { id: "trace", label: "Trace", valueType: { type: "number" } },
          {
            id: "determinant",
            label: "Determinant",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = matrix2x2NilpotencyTraceDeterminantTool.execute;
export default matrix2x2NilpotencyTraceDeterminantTool;
