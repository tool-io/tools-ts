import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly postingDate: string;
  readonly eventDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postingDate: { type: "string", maxLength: 8192 },
    eventDate: { type: "string", maxLength: 8192 },
  },
  required: ["postingDate", "eventDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure date-only public-notice lead time in signed calendar days without selecting statutory notice requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { postingDate, eventDate } = request;
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
        (namedDate(eventDate, "eventDate").getTime() -
          namedDate(postingDate, "postingDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { postingDate: "2026-10-28", eventDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const publicNoticePostingLeadTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/public-notice-posting-lead-time",
    title: "Public Notice Posting Lead Time",
    description:
      "Measure date-only public-notice lead time in signed calendar days without selecting statutory notice requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postingDate: { type: "string", maxLength: 8192 },
        eventDate: { type: "string", maxLength: 8192 },
      },
      required: ["postingDate", "eventDate"],
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
          id: "postingDate",
          label: "Posting Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventDate",
          label: "Event Date",
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
export const run = publicNoticePostingLeadTimeTool.execute;
export default publicNoticePostingLeadTimeTool;
