import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly size: number; readonly fixedPoints: number };
export type Output = { readonly remaining: number; readonly feasible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    size: { type: "integer", minimum: 0 },
    fixedPoints: { type: "integer", minimum: 0 },
  },
  required: ["size", "fixedPoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "integer" }, feasible: { type: "boolean" } },
  required: ["remaining", "feasible"],
} as const;
/** Compute permutation fixed point free budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { size, fixedPoints } = input;
  const compute = (): Output => {
    integer(size);
    integer(fixedPoints, 0, size);
    const remaining = size - fixedPoints;
    return { remaining, feasible: remaining !== 1 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { size: 5, fixedPoints: 4 },
  output: { remaining: 1, feasible: false },
} satisfies ToolExample<Input, Output>;
export const permutationFixedPointFreeBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/permutation-fixed-point-free-budget",
  title: "Permutation Fixed Point Free Budget Tool",
  description:
    "Compute permutation fixed point free budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "size",
        label: "Size",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "fixedPoints",
        label: "Fixed Points",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
      { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
    ],
  },
});
export const run = permutationFixedPointFreeBudgetTool.execute;
export default permutationFixedPointFreeBudgetTool;
