import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly size: number; readonly fixedPoints: number };
export type Output = { readonly valid: boolean; readonly pairs: number };
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
  properties: { valid: { type: "boolean" }, pairs: { type: "integer" } },
  required: ["valid", "pairs"],
} as const;
/** Compute involution single fixed point budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { size, fixedPoints } = input;
  const compute = (): Output => {
    integer(size);
    integer(fixedPoints, 0, size);
    const rest = size - fixedPoints;
    return { valid: rest % 2 === 0, pairs: Math.floor(rest / 2) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { size: 8, fixedPoints: 2 },
  output: { valid: true, pairs: 3 },
} satisfies ToolExample<Input, Output>;
export const involutionSingleFixedPointBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/involution-single-fixed-point-budget",
  title: "Involution Single Fixed Point Budget Tool",
  description:
    "Compute involution single fixed point budget from explicit bounded inputs.",
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
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      { id: "pairs", label: "Pairs", valueType: { type: "integer" } },
    ],
  },
});
export const run = involutionSingleFixedPointBudgetTool.execute;
export default involutionSingleFixedPointBudgetTool;
