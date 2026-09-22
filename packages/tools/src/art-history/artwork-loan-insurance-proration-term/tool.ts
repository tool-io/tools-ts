import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly insuredValue: number;
  readonly annualRate: number;
  readonly coveredDays: number;
  readonly yearDays: number;
};
export type Output = { readonly premium: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insuredValue: { type: "number", minimum: 0 },
    annualRate: { type: "number", minimum: 0 },
    coveredDays: { type: "number", minimum: 0 },
    yearDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["insuredValue", "annualRate", "coveredDays", "yearDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { premium: { type: "number" } },
  required: ["premium"],
} as const;
/** Simple pro rata premium with explicit rate and day-count basis, excluding minimum charges and policy conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { insuredValue, annualRate, coveredDays, yearDays } = request;
  const compute = (): Output => {
    H.domain(insuredValue >= 0 && annualRate >= 0 && coveredDays >= 0);
    H.positive(yearDays);
    return { premium: (insuredValue * annualRate * coveredDays) / yearDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    insuredValue: 100000,
    annualRate: 0.01,
    coveredDays: 30,
    yearDays: 360,
  },
  output: { premium: 83.33333333333333 },
} satisfies ToolExample<Input, Output>;
export const artworkLoanInsuranceProrationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-loan-insurance-proration-term",
    title: "Artwork Loan Insurance Proration Term Tool",
    description:
      "Simple pro rata premium with explicit rate and day-count basis, excluding minimum charges and policy conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insuredValue: { type: "number", minimum: 0 },
        annualRate: { type: "number", minimum: 0 },
        coveredDays: { type: "number", minimum: 0 },
        yearDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["insuredValue", "annualRate", "coveredDays", "yearDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { premium: { type: "number" } },
      required: ["premium"],
    },
    ports: {
      inputs: [
        {
          id: "insuredValue",
          label: "Insured Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredDays",
          label: "Covered Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "premium", label: "Premium", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = artworkLoanInsuranceProrationTermTool.execute;
export default artworkLoanInsuranceProrationTermTool;
