import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectiveDate: string;
  readonly expiryDateExclusive: string;
  readonly asOfDate: string;
};
export type Output = { readonly activeUnderDates: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDate: { type: "string", maxLength: 8192 },
    expiryDateExclusive: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["effectiveDate", "expiryDateExclusive", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeUnderDates: { type: "boolean" } },
  required: ["activeUnderDates"],
} as const;
/** Check explicitly supplied half-open effective dates without determining a health-care rule’s legal applicability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effectiveDate, expiryDateExclusive, asOfDate } = request;
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
    const start = namedDate(effectiveDate, "effectiveDate").getTime(),
      end = namedDate(expiryDateExclusive, "expiryDateExclusive").getTime(),
      at = namedDate(asOfDate, "asOfDate").getTime();
    H.domain(end >= start, "expiryDateExclusive");
    return { activeUnderDates: at >= start && at < end };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    effectiveDate: "2026-01-01",
    expiryDateExclusive: "2027-01-01",
    asOfDate: "2026-11-01",
  },
  output: { activeUnderDates: true },
} satisfies ToolExample<Input, Output>;
export const healthCareRuleEffectiveDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/health-care-rule-effective-date",
    title: "Health Care Rule Effective Date",
    description:
      "Check explicitly supplied half-open effective dates without determining a health-care rule’s legal applicability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDate: { type: "string", maxLength: 8192 },
        expiryDateExclusive: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["effectiveDate", "expiryDateExclusive", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { activeUnderDates: { type: "boolean" } },
      required: ["activeUnderDates"],
    },
    ports: {
      inputs: [
        {
          id: "effectiveDate",
          label: "Effective Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryDateExclusive",
          label: "Expiry Date Exclusive",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "activeUnderDates",
          label: "Active Under Dates",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthCareRuleEffectiveDateTool.execute;
export default healthCareRuleEffectiveDateTool;
