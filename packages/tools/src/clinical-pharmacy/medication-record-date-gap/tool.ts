import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstDate: string; readonly secondDate: string };
export type Output = { readonly days: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDate: { type: "string", maxLength: 8192 },
    secondDate: { type: "string", maxLength: 8192 },
  },
  required: ["firstDate", "secondDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { days: { type: "integer" } },
  required: ["days"],
} as const;
/** Compare explicit deidentified record dates without inferring medicine use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDate, secondDate } = request;
  const compute = (): Output => {
    return {
      days:
        (H.dateOnly(secondDate).getTime() - H.dateOnly(firstDate).getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDate: "2024-02-28", secondDate: "2024-03-01" },
  output: { days: 2 },
} satisfies ToolExample<Input, Output>;
export const medicationRecordDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medication-record-date-gap",
    title: "Medication Record Date Gap Tool",
    description:
      "Compare explicit deidentified record dates without inferring medicine use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDate: { type: "string", maxLength: 8192 },
        secondDate: { type: "string", maxLength: 8192 },
      },
      required: ["firstDate", "secondDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { days: { type: "integer" } },
      required: ["days"],
    },
    ports: {
      inputs: [
        {
          id: "firstDate",
          label: "First Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondDate",
          label: "Second Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "days", label: "Days", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = medicationRecordDateGapTool.execute;
export default medicationRecordDateGapTool;
