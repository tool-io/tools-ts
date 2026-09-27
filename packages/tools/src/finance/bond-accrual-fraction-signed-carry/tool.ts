import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualCoupon: number;
  readonly elapsedDays: number;
  readonly basisDays: number;
};
export type Output = { readonly accrued: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualCoupon: { type: "number" },
    elapsedDays: { type: "integer" },
    basisDays: { type: "integer", minimum: 1 },
  },
  required: ["annualCoupon", "elapsedDays", "basisDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { accrued: { type: "number" } },
  required: ["accrued"],
} as const;
/** Apply an explicitly supplied accrual day count and basis, allowing signed ex-coupon carry. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { annualCoupon, elapsedDays, basisDays } = input;
  const compute = (): Output => {
    H.integer(basisDays, 1);
    return { accrued: (annualCoupon * elapsedDays) / basisDays };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { annualCoupon: 60, elapsedDays: 30, basisDays: 360 },
  output: { accrued: 5 },
} satisfies ToolExample<Input, Output>;
export const bondAccrualFractionSignedCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/bond-accrual-fraction-signed-carry",
    title: "Bond Accrual Fraction Signed Carry Tool",
    description:
      "Apply an explicitly supplied accrual day count and basis, allowing signed ex-coupon carry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annualCoupon: { type: "number" },
        elapsedDays: { type: "integer" },
        basisDays: { type: "integer", minimum: 1 },
      },
      required: ["annualCoupon", "elapsedDays", "basisDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { accrued: { type: "number" } },
      required: ["accrued"],
    },
    ports: {
      inputs: [
        {
          id: "annualCoupon",
          label: "Annual Coupon",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "basisDays",
          label: "Basis Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "accrued", label: "Accrued", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bondAccrualFractionSignedCarryTool.execute;
export default bondAccrualFractionSignedCarryTool;
