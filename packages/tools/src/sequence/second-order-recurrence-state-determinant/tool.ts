import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly previous: number;
  readonly current: number;
  readonly next: number;
};
export type Output = { readonly determinant: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "number" },
    current: { type: "number" },
    next: { type: "number" },
  },
  required: ["previous", "current", "next"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { determinant: { type: "number" } },
  required: ["determinant"],
} as const;
/** Compute second order recurrence state determinant from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { previous, current, next } = input;
  const compute = (): Output => {
    return { determinant: previous * next - current * current };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { previous: 1, current: 2, next: 3 },
  output: { determinant: -1 },
} satisfies ToolExample<Input, Output>;
export const secondOrderRecurrenceStateDeterminantTool =
  defineSchemaCalculation<Input, Output>({
    id: "sequence/second-order-recurrence-state-determinant",
    title: "Second Order Recurrence State Determinant Tool",
    description:
      "Compute second order recurrence state determinant from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "next",
          label: "Next",
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
      ],
    },
  });
export const run = secondOrderRecurrenceStateDeterminantTool.execute;
export default secondOrderRecurrenceStateDeterminantTool;
