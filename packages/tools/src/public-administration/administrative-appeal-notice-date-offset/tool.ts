import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeDate: string;
  readonly days: number;
  readonly countNoticeDay: boolean;
};
export type Output = { readonly deadline: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeDate: { type: "string", maxLength: 8192 },
    days: { type: "integer", minimum: 0, maximum: 100000 },
    countNoticeDay: { type: "boolean" },
  },
  required: ["noticeDate", "days", "countNoticeDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { deadline: { type: "string", maxLength: 8192 } },
  required: ["deadline"],
} as const;
/** Civil-day addition with an explicit notice-day inclusion flag, excluding business-day and holiday rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeDate, days, countNoticeDay } = request;
  const compute = (): Output => {
    const date = H.dateOnly(noticeDate);
    H.integer(days, 0, 100000);
    H.domain(!countNoticeDay || days >= 1);
    date.setUTCDate(date.getUTCDate() + days - (countNoticeDay ? 1 : 0));
    const deadline = date.toISOString().slice(0, 10);
    H.dateOnly(deadline);
    return { deadline };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noticeDate: "2026-10-01", days: 30, countNoticeDay: false },
  output: { deadline: "2026-10-31" },
} satisfies ToolExample<Input, Output>;
export const administrativeAppealNoticeDateOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-administration/administrative-appeal-notice-date-offset",
      title: "Administrative Appeal Notice Date Offset Tool",
      description:
        "Civil-day addition with an explicit notice-day inclusion flag, excluding business-day and holiday rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noticeDate: { type: "string", maxLength: 8192 },
          days: { type: "integer", minimum: 0, maximum: 100000 },
          countNoticeDay: { type: "boolean" },
        },
        required: ["noticeDate", "days", "countNoticeDay"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { deadline: { type: "string", maxLength: 8192 } },
        required: ["deadline"],
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
            id: "days",
            label: "Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "countNoticeDay",
            label: "Count Notice Day",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "deadline", label: "Deadline", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = administrativeAppealNoticeDateOffsetTool.execute;
export default administrativeAppealNoticeDateOffsetTool;
