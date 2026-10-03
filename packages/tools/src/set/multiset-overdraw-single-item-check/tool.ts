import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly available: number; readonly requested: number };
export type Output = { readonly overdraw: boolean; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "integer", minimum: 0 },
    requested: { type: "integer", minimum: 0 },
  },
  required: ["available", "requested"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overdraw: { type: "boolean" }, remaining: { type: "integer" } },
  required: ["overdraw", "remaining"],
} as const;
/** Compute multiset overdraw single item check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { available, requested } = input;
  const compute = (): Output => {
    integer(available);
    integer(requested);
    return {
      overdraw: requested > available,
      remaining: Math.max(0, available - requested),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { available: 3, requested: 5 },
  output: { overdraw: true, remaining: 0 },
} satisfies ToolExample<Input, Output>;
export const multisetOverdrawSingleItemCheckTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/multiset-overdraw-single-item-check",
  title: "Multiset Overdraw Single Item Check Tool",
  description:
    "Compute multiset overdraw single item check from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "available",
        label: "Available",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "requested",
        label: "Requested",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "overdraw", label: "Overdraw", valueType: { type: "boolean" } },
      { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
    ],
  },
});
export const run = multisetOverdrawSingleItemCheckTool.execute;
export default multisetOverdrawSingleItemCheckTool;
