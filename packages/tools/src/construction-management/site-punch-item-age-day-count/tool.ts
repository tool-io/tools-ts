import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly raisedDate: string; readonly asOfDate: string };
export type Output = { readonly ageDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    raisedDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["raisedDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageDays: { type: "integer" } },
  required: ["ageDays"],
} as const;
/** Count calendar-day age of an explicitly recorded open punch item without assigning a defect severity or deadline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { raisedDate, asOfDate } = request;
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
    const a = namedDate(raisedDate, "raisedDate").getTime(),
      b = namedDate(asOfDate, "asOfDate").getTime();
    H.domain(b >= a, "asOfDate");
    return { ageDays: (b - a) / 86400000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { raisedDate: "2026-10-20", asOfDate: "2026-11-01" },
  output: { ageDays: 12 },
} satisfies ToolExample<Input, Output>;
export const sitePunchItemAgeDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/site-punch-item-age-day-count",
    title: "Site Punch Item Age Day Count",
    description:
      "Count calendar-day age of an explicitly recorded open punch item without assigning a defect severity or deadline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        raisedDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["raisedDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageDays: { type: "integer" } },
      required: ["ageDays"],
    },
    ports: {
      inputs: [
        {
          id: "raisedDate",
          label: "Raised Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = sitePunchItemAgeDayCountTool.execute;
export default sitePunchItemAgeDayCountTool;
