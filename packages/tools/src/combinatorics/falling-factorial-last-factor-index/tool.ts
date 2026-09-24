import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly n: number; readonly k: number };
export type Output = { readonly lastFactor: number; readonly empty: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: { type: "integer", minimum: 0 },
    k: { type: "integer", minimum: 0 },
  },
  required: ["n", "k"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lastFactor: { type: "integer" }, empty: { type: "boolean" } },
  required: ["lastFactor", "empty"],
} as const;
/** Compute falling factorial last factor index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { n, k } = input;
  const compute = (): Output => {
    integer(n);
    integer(k, 0, n);
    return { lastFactor: k === 0 ? 1 : n - k + 1, empty: k === 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { n: 7, k: 3 },
  output: { lastFactor: 5, empty: false },
} satisfies ToolExample<Input, Output>;
export const fallingFactorialLastFactorIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/falling-factorial-last-factor-index",
  title: "Falling Factorial Last Factor Index Tool",
  description:
    "Compute falling factorial last factor index from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "n", label: "N", required: true, valueType: { type: "integer" } },
      { id: "k", label: "K", required: true, valueType: { type: "integer" } },
    ],
    outputs: [
      {
        id: "lastFactor",
        label: "Last Factor",
        valueType: { type: "integer" },
      },
      { id: "empty", label: "Empty", valueType: { type: "boolean" } },
    ],
  },
});
export const run = fallingFactorialLastFactorIndexTool.execute;
export default fallingFactorialLastFactorIndexTool;
