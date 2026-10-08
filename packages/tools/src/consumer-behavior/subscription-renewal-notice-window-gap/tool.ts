import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeDate: string;
  readonly renewalDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeDate: { type: "string", maxLength: 8192 },
    renewalDate: { type: "string", maxLength: 8192 },
  },
  required: ["noticeDate", "renewalDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed date-only calendar days between supplied subscription notice and renewal without legal compliance claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeDate, renewalDate } = request;
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
        (namedDate(renewalDate, "renewalDate").getTime() -
          namedDate(noticeDate, "noticeDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noticeDate: "2026-10-28", renewalDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const subscriptionRenewalNoticeWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/subscription-renewal-notice-window-gap",
    title: "Subscription Renewal Notice Window Gap",
    description:
      "Measure signed date-only calendar days between supplied subscription notice and renewal without legal compliance claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noticeDate: { type: "string", maxLength: 8192 },
        renewalDate: { type: "string", maxLength: 8192 },
      },
      required: ["noticeDate", "renewalDate"],
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
          id: "noticeDate",
          label: "Notice Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "renewalDate",
          label: "Renewal Date",
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
export const run = subscriptionRenewalNoticeWindowGapTool.execute;
export default subscriptionRenewalNoticeWindowGapTool;
