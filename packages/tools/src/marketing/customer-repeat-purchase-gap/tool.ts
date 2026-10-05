import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousDate: string;
  readonly repeatDate: string;
};
export type Output = { readonly gapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousDate: { type: "string", maxLength: 8192 },
    repeatDate: { type: "string", maxLength: 8192 },
  },
  required: ["previousDate", "repeatDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapDays: { type: "integer" } },
  required: ["gapDays"],
} as const;
/** Count calendar days between an ordered pair of customer purchases without inferring lifetime value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousDate, repeatDate } = request;
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
    const a = namedDate(previousDate, "previousDate").getTime(),
      b = namedDate(repeatDate, "repeatDate").getTime();
    H.domain(b >= a, "");
    return { gapDays: (b - a) / 86400000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousDate: "2026-10-01", repeatDate: "2026-10-15" },
  output: { gapDays: 14 },
} satisfies ToolExample<Input, Output>;
export const customerRepeatPurchaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/customer-repeat-purchase-gap",
    title: "Customer Repeat Purchase Gap Tool",
    description:
      "Count calendar days between an ordered pair of customer purchases without inferring lifetime value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousDate: { type: "string", maxLength: 8192 },
        repeatDate: { type: "string", maxLength: 8192 },
      },
      required: ["previousDate", "repeatDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gapDays: { type: "integer" } },
      required: ["gapDays"],
    },
    ports: {
      inputs: [
        {
          id: "previousDate",
          label: "Previous Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repeatDate",
          label: "Repeat Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = customerRepeatPurchaseGapTool.execute;
export default customerRepeatPurchaseGapTool;
