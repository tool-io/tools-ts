import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly promisedPayment: number;
  readonly paid: number;
  readonly incurredExpense: number;
  readonly foregoneIncome: number;
};
export type Output = {
  readonly unpaid: number;
  readonly netOfExpense: number;
  readonly uncompensatedBurden: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promisedPayment: { type: "number", minimum: 0 },
    paid: { type: "number", minimum: 0 },
    incurredExpense: { type: "number", minimum: 0 },
    foregoneIncome: { type: "number", minimum: 0 },
  },
  required: ["promisedPayment", "paid", "incurredExpense", "foregoneIncome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unpaid: { type: "number" },
    netOfExpense: { type: "number" },
    uncompensatedBurden: { type: "number" },
  },
  required: ["unpaid", "netOfExpense", "uncompensatedBurden"],
} as const;
/** Calculate research payment foregone expense gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promisedPayment, paid, incurredExpense, foregoneIncome } = request;
  const compute = (): Output => {
    H.domain(
      promisedPayment >= 0 &&
        paid >= 0 &&
        incurredExpense >= 0 &&
        foregoneIncome >= 0,
    );
    return {
      unpaid: promisedPayment - paid,
      netOfExpense: paid - incurredExpense,
      uncompensatedBurden: incurredExpense + foregoneIncome - paid,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    promisedPayment: 100,
    paid: 80,
    incurredExpense: 30,
    foregoneIncome: 70,
  },
  output: { unpaid: 20, netOfExpense: 50, uncompensatedBurden: 20 },
} satisfies ToolExample<Input, Output>;
export const researchPaymentForegoneExpenseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/research-payment-foregone-expense-gap",
    title: "Research Payment Foregone Expense Gap Tool",
    description:
      "Calculate research payment foregone expense gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promisedPayment: { type: "number", minimum: 0 },
        paid: { type: "number", minimum: 0 },
        incurredExpense: { type: "number", minimum: 0 },
        foregoneIncome: { type: "number", minimum: 0 },
      },
      required: [
        "promisedPayment",
        "paid",
        "incurredExpense",
        "foregoneIncome",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unpaid: { type: "number" },
        netOfExpense: { type: "number" },
        uncompensatedBurden: { type: "number" },
      },
      required: ["unpaid", "netOfExpense", "uncompensatedBurden"],
    },
    ports: {
      inputs: [
        {
          id: "promisedPayment",
          label: "Promised Payment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paid",
          label: "Paid",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incurredExpense",
          label: "Incurred Expense",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foregoneIncome",
          label: "Foregone Income",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unpaid", label: "Unpaid", valueType: { type: "number" } },
        {
          id: "netOfExpense",
          label: "Net Of Expense",
          valueType: { type: "number" },
        },
        {
          id: "uncompensatedBurden",
          label: "Uncompensated Burden",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchPaymentForegoneExpenseGapTool.execute;
export default researchPaymentForegoneExpenseGapTool;
