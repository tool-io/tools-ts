import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeDate: string;
  readonly noticeDays: number;
};
export type Output = { readonly effectiveDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeDate: { type: "string", maxLength: 8192 },
    noticeDays: { type: "integer", minimum: 0, maximum: 100000 },
  },
  required: ["noticeDate", "noticeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveDate: { type: "string", maxLength: 8192 } },
  required: ["effectiveDate"],
} as const;
/** Add an explicit calendar-day notice period to a treaty notice date, excluding the notice day and without selecting legal counting rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeDate, noticeDays } = request;
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
    const d = namedDate(noticeDate, "noticeDate");
    d.setUTCDate(d.getUTCDate() + noticeDays);
    H.domain(d.getUTCFullYear() <= 9999, "");
    return { effectiveDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noticeDate: "2026-10-01", noticeDays: 30 },
  output: { effectiveDate: "2026-10-31" },
} satisfies ToolExample<Input, Output>;
export const treatyNoticeEffectiveOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-notice-effective-offset",
    title: "Treaty Notice Effective Offset Tool",
    description:
      "Add an explicit calendar-day notice period to a treaty notice date, excluding the notice day and without selecting legal counting rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noticeDate: { type: "string", maxLength: 8192 },
        noticeDays: { type: "integer", minimum: 0, maximum: 100000 },
      },
      required: ["noticeDate", "noticeDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveDate: { type: "string", maxLength: 8192 } },
      required: ["effectiveDate"],
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
          id: "noticeDays",
          label: "Notice Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "effectiveDate",
          label: "Effective Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatyNoticeEffectiveOffsetTool.execute;
export default treatyNoticeEffectiveOffsetTool;
