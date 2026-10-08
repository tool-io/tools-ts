import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asOfDate: string;
  readonly suppliedDueDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asOfDate: { type: "string", maxLength: 8192 },
    suppliedDueDate: { type: "string", maxLength: 8192 },
  },
  required: ["asOfDate", "suppliedDueDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed calendar days to an explicitly supplied emergency-cart inspection due date without selecting inspection intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asOfDate, suppliedDueDate } = request;
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
        (namedDate(suppliedDueDate, "suppliedDueDate").getTime() -
          namedDate(asOfDate, "asOfDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asOfDate: "2026-10-28", suppliedDueDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const emergencyCartInspectionDueIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/emergency-cart-inspection-due-interval",
    title: "Emergency Cart Inspection Due Interval Tool",
    description:
      "Measure signed calendar days to an explicitly supplied emergency-cart inspection due date without selecting inspection intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asOfDate: { type: "string", maxLength: 8192 },
        suppliedDueDate: { type: "string", maxLength: 8192 },
      },
      required: ["asOfDate", "suppliedDueDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "integer" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDueDate",
          label: "Supplied Due Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = emergencyCartInspectionDueIntervalTool.execute;
export default emergencyCartInspectionDueIntervalTool;
