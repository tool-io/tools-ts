import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly appearanceDate: string;
  readonly noticeOffsetDays: number;
};
export type Output = { readonly noticeDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appearanceDate: { type: "string", maxLength: 8192 },
    noticeOffsetDays: { type: "integer", minimum: 0, maximum: 3652424 },
  },
  required: ["appearanceDate", "noticeOffsetDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { noticeDate: { type: "string", maxLength: 8192 } },
  required: ["noticeDate"],
} as const;
/** Subtract an explicit calendar-day notice offset from a supplied court appearance date without selecting legal notice requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { appearanceDate, noticeOffsetDays } = request;
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
      Number.isSafeInteger(noticeOffsetDays) &&
        noticeOffsetDays >= 0 &&
        noticeOffsetDays <= 3652424,
      "noticeOffsetDays",
    ),
      noticeOffsetDays);
    const d = namedDate(appearanceDate, "appearanceDate");
    d.setUTCDate(d.getUTCDate() - noticeOffsetDays);
    H.domain(d.getUTCFullYear() >= 0, "noticeOffsetDays");
    return { noticeDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { appearanceDate: "2026-11-15", noticeOffsetDays: 14 },
  output: { noticeDate: "2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const courtAppearanceNoticeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/court-appearance-notice-offset",
    title: "Court Appearance Notice Offset",
    description:
      "Subtract an explicit calendar-day notice offset from a supplied court appearance date without selecting legal notice requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appearanceDate: { type: "string", maxLength: 8192 },
        noticeOffsetDays: { type: "integer", minimum: 0, maximum: 3652424 },
      },
      required: ["appearanceDate", "noticeOffsetDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { noticeDate: { type: "string", maxLength: 8192 } },
      required: ["noticeDate"],
    },
    ports: {
      inputs: [
        {
          id: "appearanceDate",
          label: "Appearance Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "noticeOffsetDays",
          label: "Notice Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "noticeDate",
          label: "Notice Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = courtAppearanceNoticeOffsetTool.execute;
export default courtAppearanceNoticeOffsetTool;
