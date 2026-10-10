import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedDate: string;
  readonly actualDate: string;
};
export type Output = { readonly signedCalendarDayOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedDate: { type: "string", maxLength: 8192 },
    actualDate: { type: "string", maxLength: 8192 },
  },
  required: ["plannedDate", "actualDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDayOffset: { type: "number" } },
  required: ["signedCalendarDayOffset"],
} as const;
/** Compare explicit actual and planned visit dates without determining treatment timing or acceptable delay. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedDate, actualDate } = request;
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
      signedCalendarDayOffset:
        (namedDate(actualDate, "actualDate").getTime() -
          namedDate(plannedDate, "plannedDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedDate: "2026-11-01", actualDate: "2026-11-04" },
  output: { signedCalendarDayOffset: 3 },
} satisfies ToolExample<Input, Output>;
export const oncologyVisitDueOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/oncology-visit-due-offset",
    title: "Oncology Visit Due Offset",
    description:
      "Compare explicit actual and planned visit dates without determining treatment timing or acceptable delay.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedDate: { type: "string", maxLength: 8192 },
        actualDate: { type: "string", maxLength: 8192 },
      },
      required: ["plannedDate", "actualDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDayOffset: { type: "number" } },
      required: ["signedCalendarDayOffset"],
    },
    ports: {
      inputs: [
        {
          id: "plannedDate",
          label: "Planned Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actualDate",
          label: "Actual Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDayOffset",
          label: "Signed Calendar Day Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oncologyVisitDueOffsetTool.execute;
export default oncologyVisitDueOffsetTool;
