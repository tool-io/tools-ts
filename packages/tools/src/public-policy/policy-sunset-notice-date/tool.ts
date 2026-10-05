import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sunsetDate: string;
  readonly noticeDays: number;
};
export type Output = { readonly noticeDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sunsetDate: { type: "string", maxLength: 8192 },
    noticeDays: { type: "integer", minimum: 0, maximum: 100000 },
  },
  required: ["sunsetDate", "noticeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { noticeDate: { type: "string", maxLength: 8192 } },
  required: ["noticeDate"],
} as const;
/** Subtract an explicit calendar-day notice interval from a supplied sunset date; no legal notice rule or delivery presumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sunsetDate, noticeDays } = request;
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
      Number.isSafeInteger(noticeDays) &&
        noticeDays >= 0 &&
        noticeDays <= 100000,
      "noticeDays",
    ),
      noticeDays);
    const d = namedDate(sunsetDate, "sunsetDate");
    d.setUTCDate(d.getUTCDate() - noticeDays);
    H.domain(d.getUTCFullYear() >= 0, "");
    return { noticeDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sunsetDate: "2026-12-31", noticeDays: 30 },
  output: { noticeDate: "2026-12-01" },
} satisfies ToolExample<Input, Output>;
export const policySunsetNoticeDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-sunset-notice-date",
    title: "Policy Sunset Notice Date Tool",
    description:
      "Subtract an explicit calendar-day notice interval from a supplied sunset date; no legal notice rule or delivery presumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sunsetDate: { type: "string", maxLength: 8192 },
        noticeDays: { type: "integer", minimum: 0, maximum: 100000 },
      },
      required: ["sunsetDate", "noticeDays"],
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
          id: "sunsetDate",
          label: "Sunset Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "noticeDays",
          label: "Notice Days",
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
export const run = policySunsetNoticeDateTool.execute;
export default policySunsetNoticeDateTool;
