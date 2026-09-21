import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly before: number;
  readonly after: number;
  readonly modulus: number;
  readonly wrapped: boolean;
};
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number" },
    after: { type: "number" },
    modulus: { type: "number", exclusiveMinimum: 0 },
    wrapped: { type: "boolean" },
  },
  required: ["before", "after", "modulus", "wrapped"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "number" } },
  required: ["increment"],
} as const;
/** Compute an explicit nonnegative machine-clock increment under a supplied single-wrap flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { before, after, modulus, wrapped } = request;
  const compute = (): Output => {
    H.positive(modulus);
    H.domain(
      before >= 0 &&
        before < modulus &&
        after >= 0 &&
        after < modulus &&
        (wrapped || after >= before),
    );
    return { increment: wrapped ? modulus - before + after : after - before };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { before: 95, after: 4, modulus: 100, wrapped: true },
  output: { increment: 9 },
} satisfies ToolExample<Input, Output>;
export const machineHourWrapIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/machine-hour-wrap-increment",
    title: "Machine Hour Wrap Increment Tool",
    description:
      "Compute an explicit nonnegative machine-clock increment under a supplied single-wrap flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "number" },
        after: { type: "number" },
        modulus: { type: "number", exclusiveMinimum: 0 },
        wrapped: { type: "boolean" },
      },
      required: ["before", "after", "modulus", "wrapped"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { increment: { type: "number" } },
      required: ["increment"],
    },
    ports: {
      inputs: [
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wrapped",
          label: "Wrapped",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = machineHourWrapIncrementTool.execute;
export default machineHourWrapIncrementTool;
