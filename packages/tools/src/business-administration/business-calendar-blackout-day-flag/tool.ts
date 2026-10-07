import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly date: string;
  readonly blackoutDates: readonly string[];
};
export type Output = { readonly blackout: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string", maxLength: 8192 },
    blackoutDates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["date", "blackoutDates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { blackout: { type: "boolean" } },
  required: ["blackout"],
} as const;
/** Check a Gregorian date against an explicit business-calendar blackout list without inferring holidays. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { date, blackoutDates } = request;
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
    namedDate(date, "date");
    blackoutDates.forEach((v) => namedDate(v, "blackoutDates"));
    return { blackout: blackoutDates.includes(date) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { date: "2026-12-25", blackoutDates: ["2026-12-25", "2026-12-26"] },
  output: { blackout: true },
} satisfies ToolExample<Input, Output>;
export const businessCalendarBlackoutDayFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/business-calendar-blackout-day-flag",
    title: "Business Calendar Blackout Day Flag",
    description:
      "Check a Gregorian date against an explicit business-calendar blackout list without inferring holidays.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        date: { type: "string", maxLength: 8192 },
        blackoutDates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["date", "blackoutDates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { blackout: { type: "boolean" } },
      required: ["blackout"],
    },
    ports: {
      inputs: [
        {
          id: "date",
          label: "Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "blackoutDates",
          label: "Blackout Dates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "blackout", label: "Blackout", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = businessCalendarBlackoutDayFlagTool.execute;
export default businessCalendarBlackoutDayFlagTool;
