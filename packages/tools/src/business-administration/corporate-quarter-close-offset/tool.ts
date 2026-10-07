import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quarterEndDate: string;
  readonly offsetDays: number;
};
export type Output = { readonly closeDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quarterEndDate: { type: "string", maxLength: 8192 },
    offsetDays: { type: "integer", minimum: -3652424, maximum: 3652424 },
  },
  required: ["quarterEndDate", "offsetDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closeDate: { type: "string", maxLength: 8192 } },
  required: ["closeDate"],
} as const;
/** Apply an explicit signed calendar-day close offset to a caller-supplied quarter-end date without selecting a business-day calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quarterEndDate, offsetDays } = request;
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
      Number.isSafeInteger(offsetDays) &&
        offsetDays >= -3652424 &&
        offsetDays <= 3652424,
      "offsetDays",
    ),
      offsetDays);
    const d = namedDate(quarterEndDate, "quarterEndDate");
    d.setUTCDate(d.getUTCDate() + offsetDays);
    H.domain(
      d.getUTCFullYear() >= 0 && d.getUTCFullYear() <= 9999,
      "offsetDays",
    );
    return { closeDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quarterEndDate: "2026-09-30", offsetDays: 5 },
  output: { closeDate: "2026-10-05" },
} satisfies ToolExample<Input, Output>;
export const corporateQuarterCloseOffsetTool = H.defineSchemaCalculation<
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
    id: "business-administration/corporate-quarter-close-offset",
    title: "Corporate Quarter Close Offset",
    description:
      "Apply an explicit signed calendar-day close offset to a caller-supplied quarter-end date without selecting a business-day calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quarterEndDate: { type: "string", maxLength: 8192 },
        offsetDays: { type: "integer", minimum: -3652424, maximum: 3652424 },
      },
      required: ["quarterEndDate", "offsetDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closeDate: { type: "string", maxLength: 8192 } },
      required: ["closeDate"],
    },
    ports: {
      inputs: [
        {
          id: "quarterEndDate",
          label: "Quarter End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "offsetDays",
          label: "Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "closeDate", label: "Close Date", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = corporateQuarterCloseOffsetTool.execute;
export default corporateQuarterCloseOffsetTool;
