import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly calendarDate: string;
  readonly weekdayToken: string;
};
export type Output = {
  readonly matches: boolean;
  readonly expectedWeekday: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarDate: { type: "string", maxLength: 8192 },
    weekdayToken: {
      type: "string",
      maxLength: 8192,
      enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
  },
  required: ["calendarDate", "weekdayToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    expectedWeekday: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "expectedWeekday"],
} as const;
/** Compare an explicit HTTP-date weekday token with a supplied Gregorian calendar date without parsing a complete HTTP date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { calendarDate, weekdayToken } = request;
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
    H.domain(
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(weekdayToken),
      "weekdayToken",
    );
    return (() => {
      const expectedWeekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        namedDate(calendarDate, "calendarDate").getUTCDay()
      ];
      return { matches: weekdayToken === expectedWeekday, expectedWeekday };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { calendarDate: "2026-11-01", weekdayToken: "Sun" },
  output: { matches: true, expectedWeekday: "Sun" },
} satisfies ToolExample<Input, Output>;
export const httpDateWeekdayTokenMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["parse", "data parsing", "computer science"],
      keywords: ["data parsing", "computer science"],
    },
    id: "parse/http-date-weekday-token-match",
    title: "HTTP Date Weekday Token Match",
    description:
      "Compare an explicit HTTP-date weekday token with a supplied Gregorian calendar date without parsing a complete HTTP date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarDate: { type: "string", maxLength: 8192 },
        weekdayToken: {
          type: "string",
          maxLength: 8192,
          enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        },
      },
      required: ["calendarDate", "weekdayToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        expectedWeekday: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "expectedWeekday"],
    },
    ports: {
      inputs: [
        {
          id: "calendarDate",
          label: "Calendar Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "weekdayToken",
          label: "Weekday Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "expectedWeekday",
          label: "Expected Weekday",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpDateWeekdayTokenMatchTool.execute;
export default httpDateWeekdayTokenMatchTool;
