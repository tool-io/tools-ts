import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualFee: number;
  readonly unusedDays: number;
  readonly yearDays: number;
};
export type Output = { readonly reimbursement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualFee: { type: "number", minimum: 0 },
    unusedDays: { type: "integer", minimum: 0 },
    yearDays: { type: "integer", minimum: 1 },
  },
  required: ["annualFee", "unusedDays", "yearDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reimbursement: { type: "number" } },
  required: ["reimbursement"],
} as const;
/** Prorate an annual fee over a supplied year basis and unused day count. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { annualFee, unusedDays, yearDays } = input;
  const compute = (): Output => {
    H.domain(annualFee >= 0);
    H.integer(yearDays, 1);
    H.integer(unusedDays, 0, yearDays);
    return { reimbursement: (annualFee * unusedDays) / yearDays };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { annualFee: 120, unusedDays: 90, yearDays: 360 },
  output: { reimbursement: 30 },
} satisfies ToolExample<Input, Output>;
export const annualFeePartYearReimbursementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/annual-fee-part-year-reimbursement",
    title: "Annual Fee Part Year Reimbursement Tool",
    description:
      "Prorate an annual fee over a supplied year basis and unused day count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualFee: { type: "number", minimum: 0 },
        unusedDays: { type: "integer", minimum: 0 },
        yearDays: { type: "integer", minimum: 1 },
      },
      required: ["annualFee", "unusedDays", "yearDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reimbursement: { type: "number" } },
      required: ["reimbursement"],
    },
    ports: {
      inputs: [
        {
          id: "annualFee",
          label: "Annual Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unusedDays",
          label: "Unused Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "reimbursement",
          label: "Reimbursement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = annualFeePartYearReimbursementTool.execute;
export default annualFeePartYearReimbursementTool;
