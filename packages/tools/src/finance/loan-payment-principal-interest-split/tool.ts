import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payment: number;
  readonly interestCharge: number;
};
export type Output = { readonly principal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payment: { type: "number", minimum: 0 },
    interestCharge: { type: "number", minimum: 0 },
  },
  required: ["payment", "interestCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { principal: { type: "number" } },
  required: ["principal"],
} as const;
/** Split a supplied loan payment after a supplied interest charge. A negative principal component explicitly represents negative amortization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payment, interestCharge } = request;
  const compute = (): Output => {
    H.domain(payment >= 0 && interestCharge >= 0, "payment");
    return { principal: payment - interestCharge };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payment: 1200, interestCharge: 350 },
  output: { principal: 850 },
} satisfies ToolExample<Input, Output>;
export const loanPaymentPrincipalInterestSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/loan-payment-principal-interest-split",
    title: "Loan Payment Principal Interest Split Tool",
    description:
      "Split a supplied loan payment after a supplied interest charge. A negative principal component explicitly represents negative amortization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payment: { type: "number", minimum: 0 },
        interestCharge: { type: "number", minimum: 0 },
      },
      required: ["payment", "interestCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { principal: { type: "number" } },
      required: ["principal"],
    },
    ports: {
      inputs: [
        {
          id: "payment",
          label: "Payment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interestCharge",
          label: "Interest Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "principal", label: "Principal", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = loanPaymentPrincipalInterestSplitTool.execute;
export default loanPaymentPrincipalInterestSplitTool;
