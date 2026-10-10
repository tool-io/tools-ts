import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grantAmount: number;
  readonly totalGrantAndLoanAmount: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grantAmount: { type: "number", minimum: 0 },
    totalGrantAndLoanAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["grantAmount", "totalGrantAndLoanAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicit grant amount to compatible total grant-and-loan aid without assessing aid eligibility or effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grantAmount, totalGrantAndLoanAmount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalGrantAndLoanAmount) && totalGrantAndLoanAmount > 0,
      "totalGrantAndLoanAmount",
    ),
      totalGrantAndLoanAmount);
    H.domain(
      grantAmount >= 0 && grantAmount <= totalGrantAndLoanAmount,
      "grantAmount",
    );
    return {
      fraction: grantAmount / totalGrantAndLoanAmount,
      remainder: totalGrantAndLoanAmount - grantAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grantAmount: 30, totalGrantAndLoanAmount: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const bilateralAidGrantLoanShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "international-relations",
        "international relations",
        "social sciences",
      ],
      keywords: ["international relations", "social sciences"],
    },
    id: "international-relations/bilateral-aid-grant-loan-share",
    title: "Bilateral Aid Grant Loan Share",
    description:
      "Normalize an explicit grant amount to compatible total grant-and-loan aid without assessing aid eligibility or effectiveness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grantAmount: { type: "number", minimum: 0 },
        totalGrantAndLoanAmount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["grantAmount", "totalGrantAndLoanAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "grantAmount",
          label: "Grant Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalGrantAndLoanAmount",
          label: "Total Grant And Loan Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bilateralAidGrantLoanShareTool.execute;
export default bilateralAidGrantLoanShareTool;
