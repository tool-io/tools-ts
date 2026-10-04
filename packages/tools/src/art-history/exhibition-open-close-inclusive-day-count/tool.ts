import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingDate: string;
  readonly closingDate: string;
};
export type Output = { readonly inclusiveDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingDate: { type: "string", maxLength: 8192 },
    closingDate: { type: "string", maxLength: 8192 },
  },
  required: ["openingDate", "closingDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inclusiveDays: { type: "integer" } },
  required: ["inclusiveDays"],
} as const;
/** Count Gregorian calendar exhibition days including opening and closing dates; closure weekdays are not subtracted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingDate, closingDate } = request;
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
    const a = namedDate(openingDate, "openingDate").getTime(),
      b = namedDate(closingDate, "closingDate").getTime();
    H.domain(b >= a, "closingDate");
    return { inclusiveDays: (b - a) / 86400000 + 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingDate: "2026-10-01", closingDate: "2026-10-10" },
  output: { inclusiveDays: 10 },
} satisfies ToolExample<Input, Output>;
export const exhibitionOpenCloseInclusiveDayCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-history/exhibition-open-close-inclusive-day-count",
      title: "Exhibition Open Close Inclusive Day Count Tool",
      description:
        "Count Gregorian calendar exhibition days including opening and closing dates; closure weekdays are not subtracted.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingDate: { type: "string", maxLength: 8192 },
          closingDate: { type: "string", maxLength: 8192 },
        },
        required: ["openingDate", "closingDate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { inclusiveDays: { type: "integer" } },
        required: ["inclusiveDays"],
      },
      ports: {
        inputs: [
          {
            id: "openingDate",
            label: "Opening Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "closingDate",
            label: "Closing Date",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "inclusiveDays",
            label: "Inclusive Days",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = exhibitionOpenCloseInclusiveDayCountTool.execute;
export default exhibitionOpenCloseInclusiveDayCountTool;
