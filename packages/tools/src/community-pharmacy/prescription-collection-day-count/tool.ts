import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly readyDate: string;
  readonly collectionDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readyDate: { type: "string", maxLength: 8192 },
    collectionDate: { type: "string", maxLength: 8192 },
  },
  required: ["readyDate", "collectionDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days between explicitly recorded ready and collection dates without determining expiry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { readyDate, collectionDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return {
      signedCalendarDays:
        (namedDate(collectionDate, "collectionDate").getTime() -
          namedDate(readyDate, "readyDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { readyDate: "2026-10-28", collectionDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const prescriptionCollectionDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/prescription-collection-day-count",
    title: "Prescription Collection Day Count",
    description:
      "Count signed calendar days between explicitly recorded ready and collection dates without determining expiry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readyDate: { type: "string", maxLength: 8192 },
        collectionDate: { type: "string", maxLength: 8192 },
      },
      required: ["readyDate", "collectionDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "number" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "readyDate",
          label: "Ready Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectionDate",
          label: "Collection Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prescriptionCollectionDayCountTool.execute;
export default prescriptionCollectionDayCountTool;
