import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly renewalCharge: number;
  readonly creditAmount: number;
};
export type Output = {
  readonly amountDue: number;
  readonly excessCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    renewalCharge: { type: "number", minimum: 0 },
    creditAmount: { type: "number", minimum: 0 },
  },
  required: ["renewalCharge", "creditAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountDue: { type: "number" },
    excessCredit: { type: "number" },
  },
  required: ["amountDue", "excessCredit"],
} as const;
/** Apply a recorded credit to one renewal charge and preserve any excess balance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { renewalCharge, creditAmount } = request;
  const compute = (): Output => {
    H.domain(renewalCharge >= 0 && creditAmount >= 0, "renewalCharge");
    return {
      amountDue: Math.max(0, renewalCharge - creditAmount),
      excessCredit: Math.max(0, creditAmount - renewalCharge),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { renewalCharge: 100, creditAmount: 25 },
  output: { amountDue: 75, excessCredit: 0 },
} satisfies ToolExample<Input, Output>;
export const subscriptionRenewalCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/subscription-renewal-credit",
    title: "Subscription Renewal Credit Tool",
    description:
      "Apply a recorded credit to one renewal charge and preserve any excess balance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        renewalCharge: { type: "number", minimum: 0 },
        creditAmount: { type: "number", minimum: 0 },
      },
      required: ["renewalCharge", "creditAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountDue: { type: "number" },
        excessCredit: { type: "number" },
      },
      required: ["amountDue", "excessCredit"],
    },
    ports: {
      inputs: [
        {
          id: "renewalCharge",
          label: "Renewal Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditAmount",
          label: "Credit Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "amountDue", label: "Amount Due", valueType: { type: "number" } },
        {
          id: "excessCredit",
          label: "Excess Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = subscriptionRenewalCreditTool.execute;
export default subscriptionRenewalCreditTool;
