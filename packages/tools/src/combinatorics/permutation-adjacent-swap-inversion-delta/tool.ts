import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { left: { type: "number" }, right: { type: "number" } },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delta: { type: "integer" } },
  required: ["delta"],
} as const;
/** Compute permutation adjacent swap inversion delta from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    return { delta: left < right ? 1 : left > right ? -1 : 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 2, right: 5 },
  output: { delta: 1 },
} satisfies ToolExample<Input, Output>;
export const permutationAdjacentSwapInversionDeltaTool =
  defineSchemaCalculation<Input, Output>({
    id: "combinatorics/permutation-adjacent-swap-inversion-delta",
    title: "Permutation Adjacent Swap Inversion Delta Tool",
    description:
      "Compute permutation adjacent swap inversion delta from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  });
export const run = permutationAdjacentSwapInversionDeltaTool.execute;
export default permutationAdjacentSwapInversionDeltaTool;
