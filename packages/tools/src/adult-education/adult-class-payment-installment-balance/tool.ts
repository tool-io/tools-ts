import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly courseFee: number;
  readonly deposit: number;
  readonly installmentsPaid: readonly number[];
  readonly credit: number;
  readonly remainingInstallments: number;
};
export type Output = {
  readonly outstanding: number;
  readonly perRemainingInstallment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    courseFee: { type: "number", minimum: 0 },
    deposit: { type: "number", minimum: 0 },
    installmentsPaid: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    credit: { type: "number", minimum: 0 },
    remainingInstallments: { type: "integer", minimum: 1 },
  },
  required: [
    "courseFee",
    "deposit",
    "installmentsPaid",
    "credit",
    "remainingInstallments",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outstanding: { type: "number" },
    perRemainingInstallment: { type: "number" },
  },
  required: ["outstanding", "perRemainingInstallment"],
} as const;
/** Calculate adult class payment installment balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    courseFee,
    deposit,
    installmentsPaid,
    credit,
    remainingInstallments,
  } = request;
  const compute = (): Output => {
    H.domain(
      courseFee >= 0 &&
        deposit >= 0 &&
        credit >= 0 &&
        installmentsPaid.every((x) => x >= 0),
    );
    H.integer(remainingInstallments, 1);
    return {
      outstanding:
        courseFee -
        deposit -
        installmentsPaid.reduce((a, b) => a + b, 0) -
        credit,
      perRemainingInstallment:
        (courseFee -
          deposit -
          installmentsPaid.reduce((a, b) => a + b, 0) -
          credit) /
        remainingInstallments,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    courseFee: 1000,
    deposit: 100,
    installmentsPaid: [200, 200],
    credit: 100,
    remainingInstallments: 2,
  },
  output: { outstanding: 400, perRemainingInstallment: 200 },
} satisfies ToolExample<Input, Output>;
export const adultClassPaymentInstallmentBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/adult-class-payment-installment-balance",
      title: "Adult Class Payment Installment Balance Tool",
      description:
        "Calculate adult class payment installment balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          courseFee: { type: "number", minimum: 0 },
          deposit: { type: "number", minimum: 0 },
          installmentsPaid: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          credit: { type: "number", minimum: 0 },
          remainingInstallments: { type: "integer", minimum: 1 },
        },
        required: [
          "courseFee",
          "deposit",
          "installmentsPaid",
          "credit",
          "remainingInstallments",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outstanding: { type: "number" },
          perRemainingInstallment: { type: "number" },
        },
        required: ["outstanding", "perRemainingInstallment"],
      },
      ports: {
        inputs: [
          {
            id: "courseFee",
            label: "Course Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deposit",
            label: "Deposit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "installmentsPaid",
            label: "Installments Paid",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "credit",
            label: "Credit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "remainingInstallments",
            label: "Remaining Installments",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "outstanding",
            label: "Outstanding",
            valueType: { type: "number" },
          },
          {
            id: "perRemainingInstallment",
            label: "Per Remaining Installment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = adultClassPaymentInstallmentBalanceTool.execute;
export default adultClassPaymentInstallmentBalanceTool;
