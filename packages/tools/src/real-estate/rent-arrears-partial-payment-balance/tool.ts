import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingArrears: number;
  readonly newRent: number;
  readonly payment: number;
  readonly credit: number;
};
export type Output = {
  readonly balance: number;
  readonly arrears: number;
  readonly overpayment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingArrears: { type: "number", minimum: 0 },
    newRent: { type: "number", minimum: 0 },
    payment: { type: "number", minimum: 0 },
    credit: { type: "number", minimum: 0 },
  },
  required: ["openingArrears", "newRent", "payment", "credit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balance: { type: "number" },
    arrears: { type: "number" },
    overpayment: { type: "number" },
  },
  required: ["balance", "arrears", "overpayment"],
} as const;
/** Calculate rent arrears partial payment balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingArrears, newRent, payment, credit } = request;
  const compute = (): Output => {
    H.domain(
      openingArrears >= 0 && newRent >= 0 && payment >= 0 && credit >= 0,
    );
    return {
      balance: openingArrears + newRent - payment - credit,
      arrears: Math.max(0, openingArrears + newRent - payment - credit),
      overpayment: Math.max(0, payment + credit - openingArrears - newRent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingArrears: 200, newRent: 1000, payment: 800, credit: 100 },
  output: { balance: 300, arrears: 300, overpayment: 0 },
} satisfies ToolExample<Input, Output>;
export const rentArrearsPartialPaymentBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/rent-arrears-partial-payment-balance",
    title: "Rent Arrears Partial Payment Balance Tool",
    description:
      "Calculate rent arrears partial payment balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingArrears: { type: "number", minimum: 0 },
        newRent: { type: "number", minimum: 0 },
        payment: { type: "number", minimum: 0 },
        credit: { type: "number", minimum: 0 },
      },
      required: ["openingArrears", "newRent", "payment", "credit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        balance: { type: "number" },
        arrears: { type: "number" },
        overpayment: { type: "number" },
      },
      required: ["balance", "arrears", "overpayment"],
    },
    ports: {
      inputs: [
        {
          id: "openingArrears",
          label: "Opening Arrears",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newRent",
          label: "New Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "payment",
          label: "Payment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "credit",
          label: "Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "balance", label: "Balance", valueType: { type: "number" } },
        { id: "arrears", label: "Arrears", valueType: { type: "number" } },
        {
          id: "overpayment",
          label: "Overpayment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rentArrearsPartialPaymentBalanceTool.execute;
export default rentArrearsPartialPaymentBalanceTool;
