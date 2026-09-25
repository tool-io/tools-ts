import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly simultaneous: number;
  readonly otherDuplicate: number;
};
export type Output = { readonly uniqueMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0 },
    second: { type: "number", minimum: 0 },
    simultaneous: { type: "number", minimum: 0 },
    otherDuplicate: { type: "number", minimum: 0 },
  },
  required: ["first", "second", "simultaneous", "otherDuplicate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uniqueMinutes: { type: "number" } },
  required: ["uniqueMinutes"],
} as const;
/** Deduct independently annotated simultaneous and other repeated household-activity records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, simultaneous, otherDuplicate } = request;
  const compute = (): Output => {
    H.domain(
      first >= 0 &&
        second >= 0 &&
        simultaneous >= 0 &&
        simultaneous <= Math.min(first, second) &&
        otherDuplicate >= 0 &&
        otherDuplicate <= first + second - simultaneous,
    );
    return { uniqueMinutes: first + second - simultaneous - otherDuplicate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 30, second: 40, simultaneous: 10, otherDuplicate: 5 },
  output: { uniqueMinutes: 55 },
} satisfies ToolExample<Input, Output>;
export const householdActivityDoubleCountMinuteTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/household-activity-double-count-minute",
    title: "Household Activity Double Count Minute Tool",
    description:
      "Deduct independently annotated simultaneous and other repeated household-activity records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0 },
        second: { type: "number", minimum: 0 },
        simultaneous: { type: "number", minimum: 0 },
        otherDuplicate: { type: "number", minimum: 0 },
      },
      required: ["first", "second", "simultaneous", "otherDuplicate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { uniqueMinutes: { type: "number" } },
      required: ["uniqueMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "simultaneous",
          label: "Simultaneous",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherDuplicate",
          label: "Other Duplicate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueMinutes",
          label: "Unique Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdActivityDoubleCountMinuteTool.execute;
export default householdActivityDoubleCountMinuteTool;
