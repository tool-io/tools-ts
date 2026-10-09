import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly amount: number;
  readonly currencyCode: string;
  readonly paymentUnit: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    amount: { type: "number" },
    currencyCode: { type: "string", maxLength: 8192, minLength: 1 },
    paymentUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "amount", "currencyCode", "paymentUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit provider payment rate and unit without determining a reimbursement method or entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, amount, currencyCode, paymentUnit } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 && currencyCode.length > 0 && paymentUnit.length > 0,
      "recordId",
    );
    return {
      label:
        recordId + "; " + amount + " " + currencyCode + " per " + paymentUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "P17",
    amount: 50,
    currencyCode: "USD",
    paymentUnit: "recorded visit",
  },
  output: { label: "P17; 50 USD per recorded visit" },
} satisfies ToolExample<Input, Output>;
export const providerPaymentUnitLabelTool = H.defineSchemaCalculation<
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
    id: "health-policy/provider-payment-unit-label",
    title: "Provider Payment Unit Label",
    description:
      "Label an explicit provider payment rate and unit without determining a reimbursement method or entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        amount: { type: "number" },
        currencyCode: { type: "string", maxLength: 8192, minLength: 1 },
        paymentUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "amount", "currencyCode", "paymentUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currencyCode",
          label: "Currency Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "paymentUnit",
          label: "Payment Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = providerPaymentUnitLabelTool.execute;
export default providerPaymentUnitLabelTool;
