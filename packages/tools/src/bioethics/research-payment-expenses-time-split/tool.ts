import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hours: number;
  readonly hourlyAmount: number;
  readonly expenses: number;
  readonly fixedPayment: number;
};
export type Output = {
  readonly timeCompensation: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hours: { type: "number", minimum: 0 },
    hourlyAmount: { type: "number", minimum: 0 },
    expenses: { type: "number", minimum: 0 },
    fixedPayment: { type: "number", minimum: 0 },
  },
  required: ["hours", "hourlyAmount", "expenses", "fixedPayment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeCompensation: { type: "number" },
    total: { type: "number" },
  },
  required: ["timeCompensation", "total"],
} as const;
/** Calculate research payment expenses time split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hours, hourlyAmount, expenses, fixedPayment } = request;
  const compute = (): Output => {
    H.domain(
      hours >= 0 && hourlyAmount >= 0 && expenses >= 0 && fixedPayment >= 0,
    );
    return {
      timeCompensation: hours * hourlyAmount,
      total: hours * hourlyAmount + expenses + fixedPayment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hours: 2, hourlyAmount: 15, expenses: 8, fixedPayment: 5 },
  output: { timeCompensation: 30, total: 43 },
} satisfies ToolExample<Input, Output>;
export const researchPaymentExpensesTimeSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/research-payment-expenses-time-split",
    title: "Research Payment Expenses Time Split Tool",
    description:
      "Calculate research payment expenses time split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hours: { type: "number", minimum: 0 },
        hourlyAmount: { type: "number", minimum: 0 },
        expenses: { type: "number", minimum: 0 },
        fixedPayment: { type: "number", minimum: 0 },
      },
      required: ["hours", "hourlyAmount", "expenses", "fixedPayment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeCompensation: { type: "number" },
        total: { type: "number" },
      },
      required: ["timeCompensation", "total"],
    },
    ports: {
      inputs: [
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyAmount",
          label: "Hourly Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expenses",
          label: "Expenses",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedPayment",
          label: "Fixed Payment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "timeCompensation",
          label: "Time Compensation",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchPaymentExpensesTimeSplitTool.execute;
export default researchPaymentExpensesTimeSplitTool;
