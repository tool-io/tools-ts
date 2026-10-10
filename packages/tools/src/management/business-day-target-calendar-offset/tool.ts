import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDate: string;
  readonly suppliedCalendarOffsetDays: number;
};
export type Output = { readonly targetDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDate: { type: "string", maxLength: 8192 },
    suppliedCalendarOffsetDays: { type: "integer" },
  },
  required: ["referenceDate", "suppliedCalendarOffsetDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetDate: { type: "string", maxLength: 8192 } },
  required: ["targetDate"],
} as const;
/** Apply an already resolved calendar-day offset for a business-day target without calculating working days or holiday calendars. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDate, suppliedCalendarOffsetDays } = request;
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
    (H.domain(
      Number.isSafeInteger(suppliedCalendarOffsetDays) &&
        suppliedCalendarOffsetDays >= -Number.MAX_SAFE_INTEGER &&
        suppliedCalendarOffsetDays <= Number.MAX_SAFE_INTEGER,
      "suppliedCalendarOffsetDays",
    ),
      suppliedCalendarOffsetDays);
    return {
      targetDate: (() => {
        const d = namedDate(referenceDate, "referenceDate");
        d.setUTCDate(d.getUTCDate() + suppliedCalendarOffsetDays);
        H.domain(
          Number.isFinite(d.getTime()) &&
            d.getUTCFullYear() >= 0 &&
            d.getUTCFullYear() <= 9999,
          "suppliedCalendarOffsetDays",
        );
        return d.toISOString().slice(0, 10);
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDate: "2026-10-28", suppliedCalendarOffsetDays: 4 },
  output: { targetDate: "2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const businessDayTargetCalendarOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/business-day-target-calendar-offset",
    title: "Business Day Target Calendar Offset",
    description:
      "Apply an already resolved calendar-day offset for a business-day target without calculating working days or holiday calendars.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDate: { type: "string", maxLength: 8192 },
        suppliedCalendarOffsetDays: { type: "integer" },
      },
      required: ["referenceDate", "suppliedCalendarOffsetDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetDate: { type: "string", maxLength: 8192 } },
      required: ["targetDate"],
    },
    ports: {
      inputs: [
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCalendarOffsetDays",
          label: "Supplied Calendar Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "targetDate",
          label: "Target Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = businessDayTargetCalendarOffsetTool.execute;
export default businessDayTargetCalendarOffsetTool;
