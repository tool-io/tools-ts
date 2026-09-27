import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly interest: number;
  readonly payment: number;
};
export type Output = { readonly balance: number; readonly overpayment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    interest: { type: "number" },
    payment: { type: "number", minimum: 0 },
  },
  required: ["opening", "interest", "payment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { balance: { type: "number" }, overpayment: { type: "number" } },
  required: ["balance", "overpayment"],
} as const;
/** Separate a next installment balance from excess cash after explicitly supplied accrued interest. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { opening, interest, payment } = input;
  const compute = (): Output => {
    H.domain(opening >= 0 && payment >= 0);
    const raw = opening + interest - payment;
    return { balance: Math.max(0, raw), overpayment: Math.max(0, -raw) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { opening: 100, interest: 5, payment: 120 },
  output: { balance: 0, overpayment: 15 },
} satisfies ToolExample<Input, Output>;
export const installmentOverpaymentNextBalanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/installment-overpayment-next-balance-term",
      title: "Installment Overpayment Next Balance Term Tool",
      description:
        "Separate a next installment balance from excess cash after explicitly supplied accrued interest.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "number", minimum: 0 },
          interest: { type: "number" },
          payment: { type: "number", minimum: 0 },
        },
        required: ["opening", "interest", "payment"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          balance: { type: "number" },
          overpayment: { type: "number" },
        },
        required: ["balance", "overpayment"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interest",
            label: "Interest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "payment",
            label: "Payment",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "balance", label: "Balance", valueType: { type: "number" } },
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
export const run = installmentOverpaymentNextBalanceTermTool.execute;
export default installmentOverpaymentNextBalanceTermTool;
