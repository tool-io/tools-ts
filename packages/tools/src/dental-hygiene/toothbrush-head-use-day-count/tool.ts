import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstUseDate: string;
  readonly asOfDate: string;
  readonly countFirstDay: boolean;
};
export type Output = { readonly useDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstUseDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
    countFirstDay: { type: "boolean" },
  },
  required: ["firstUseDate", "asOfDate", "countFirstDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { useDays: { type: "integer" } },
  required: ["useDays"],
} as const;
/** Count explicitly recorded toothbrush-head calendar use days under a supplied first-day convention without recommending replacement timing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstUseDate, asOfDate, countFirstDay } = request;
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
    const a = namedDate(firstUseDate, "firstUseDate").getTime(),
      b = namedDate(asOfDate, "asOfDate").getTime();
    H.domain(b >= a, "asOfDate");
    return { useDays: (b - a) / 86400000 + (countFirstDay ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstUseDate: "2026-10-01",
    asOfDate: "2026-11-01",
    countFirstDay: true,
  },
  output: { useDays: 32 },
} satisfies ToolExample<Input, Output>;
export const toothbrushHeadUseDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/toothbrush-head-use-day-count",
    title: "Toothbrush Head Use Day Count",
    description:
      "Count explicitly recorded toothbrush-head calendar use days under a supplied first-day convention without recommending replacement timing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstUseDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
        countFirstDay: { type: "boolean" },
      },
      required: ["firstUseDate", "asOfDate", "countFirstDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { useDays: { type: "integer" } },
      required: ["useDays"],
    },
    ports: {
      inputs: [
        {
          id: "firstUseDate",
          label: "First Use Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "countFirstDay",
          label: "Count First Day",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "useDays", label: "Use Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = toothbrushHeadUseDayCountTool.execute;
export default toothbrushHeadUseDayCountTool;
