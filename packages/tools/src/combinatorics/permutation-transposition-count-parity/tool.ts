import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly count: number };
export type Output = { readonly sign: number; readonly even: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer", minimum: 0 } },
  required: ["count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" }, even: { type: "boolean" } },
  required: ["sign", "even"],
} as const;
/** Compute permutation transposition count parity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { count } = input;
  const compute = (): Output => {
    integer(count);
    return { sign: count % 2 ? -1 : 1, even: count % 2 === 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 3 },
  output: { sign: -1, even: false },
} satisfies ToolExample<Input, Output>;
export const permutationTranspositionCountParityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/permutation-transposition-count-parity",
  title: "Permutation Transposition Count Parity Tool",
  description:
    "Compute permutation transposition count parity from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "count",
        label: "Count",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "sign", label: "Sign", valueType: { type: "integer" } },
      { id: "even", label: "Even", valueType: { type: "boolean" } },
    ],
  },
});
export const run = permutationTranspositionCountParityTool.execute;
export default permutationTranspositionCountParityTool;
