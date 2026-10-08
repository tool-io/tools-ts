import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialDate: string;
  readonly repeatPurchaseDate: string;
};
export type Output = { readonly gapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialDate: { type: "string", maxLength: 8192 },
    repeatPurchaseDate: { type: "string", maxLength: 8192 },
  },
  required: ["trialDate", "repeatPurchaseDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapDays: { type: "integer" } },
  required: ["gapDays"],
} as const;
/** Count Gregorian calendar days between an explicitly recorded product trial and repeat purchase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialDate, repeatPurchaseDate } = request;
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
    const a = namedDate(trialDate, "trialDate").getTime(),
      b = namedDate(repeatPurchaseDate, "repeatPurchaseDate").getTime();
    H.domain(b >= a, "repeatPurchaseDate");
    return { gapDays: (b - a) / 86400000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialDate: "2026-10-01", repeatPurchaseDate: "2026-11-01" },
  output: { gapDays: 31 },
} satisfies ToolExample<Input, Output>;
export const productTrialToRepeatGapTool = H.defineSchemaCalculation<
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
    id: "consumer-behavior/product-trial-to-repeat-gap",
    title: "Product Trial To Repeat Gap",
    description:
      "Count Gregorian calendar days between an explicitly recorded product trial and repeat purchase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialDate: { type: "string", maxLength: 8192 },
        repeatPurchaseDate: { type: "string", maxLength: 8192 },
      },
      required: ["trialDate", "repeatPurchaseDate"],
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
          id: "trialDate",
          label: "Trial Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repeatPurchaseDate",
          label: "Repeat Purchase Date",
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
export const run = productTrialToRepeatGapTool.execute;
export default productTrialToRepeatGapTool;
