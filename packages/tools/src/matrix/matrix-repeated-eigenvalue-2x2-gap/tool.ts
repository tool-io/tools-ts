import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = {
  readonly discriminant: number;
  readonly repeated: boolean;
  readonly real: boolean;
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
    discriminant: { type: "number" },
    repeated: { type: "boolean" },
    real: { type: "boolean" },
  },
  required: ["discriminant", "repeated", "real"],
} as const;
/** Compute matrix repeated eigenvalue 2x2 gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { a, b, c, d } = input;
  const compute = (): Output => {
    const discriminant = (a - d) ** 2 + 4 * b * c;
    return {
      discriminant,
      repeated: discriminant === 0,
      real: discriminant >= 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 1, c: 0, d: 2 },
  output: { discriminant: 0, repeated: true, real: true },
} satisfies ToolExample<Input, Output>;
export const matrixRepeatedEigenvalue2x2GapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-repeated-eigenvalue-2x2-gap",
  title: "Matrix Repeated Eigenvalue 2x2 Gap Tool",
  description:
    "Compute matrix repeated eigenvalue 2x2 gap from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "a", label: "A", required: true, valueType: { type: "number" } },
      { id: "b", label: "B", required: true, valueType: { type: "number" } },
      { id: "c", label: "C", required: true, valueType: { type: "number" } },
      { id: "d", label: "D", required: true, valueType: { type: "number" } },
    ],
    outputs: [
      {
        id: "discriminant",
        label: "Discriminant",
        valueType: { type: "number" },
      },
      { id: "repeated", label: "Repeated", valueType: { type: "boolean" } },
      { id: "real", label: "Real", valueType: { type: "boolean" } },
    ],
  },
});
export const run = matrixRepeatedEigenvalue2x2GapTool.execute;
export default matrixRepeatedEigenvalue2x2GapTool;
