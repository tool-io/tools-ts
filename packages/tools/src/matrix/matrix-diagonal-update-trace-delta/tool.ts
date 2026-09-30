import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly trace: number; readonly increment: number };
export type Output = { readonly updatedTrace: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { trace: { type: "number" }, increment: { type: "number" } },
  required: ["trace", "increment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { updatedTrace: { type: "number" }, delta: { type: "number" } },
  required: ["updatedTrace", "delta"],
} as const;
/** Calculate matrix diagonal update trace delta from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { trace, increment } = input;
  const compute = (): Output => {
    return { updatedTrace: trace + increment, delta: increment };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { trace: 10, increment: 3 },
  output: { updatedTrace: 13, delta: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixDiagonalUpdateTraceDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-diagonal-update-trace-delta",
    title: "Matrix Diagonal Update Trace Delta Tool",
    description:
      "Calculate matrix diagonal update trace delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { trace: { type: "number" }, increment: { type: "number" } },
      required: ["trace", "increment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        updatedTrace: { type: "number" },
        delta: { type: "number" },
      },
      required: ["updatedTrace", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "trace",
          label: "Trace",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "increment",
          label: "Increment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "updatedTrace",
          label: "Updated Trace",
          valueType: { type: "number" },
        },
        { id: "delta", label: "Delta", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = matrixDiagonalUpdateTraceDeltaTool.execute;
export default matrixDiagonalUpdateTraceDeltaTool;
