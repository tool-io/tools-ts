import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledRepayment: number;
  readonly optionalRepayment: number;
  readonly availableCash: number;
};
export type Output = {
  readonly totalRepayment: number;
  readonly cashShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledRepayment: { type: "number", minimum: 0 },
    optionalRepayment: { type: "number", minimum: 0 },
    availableCash: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["scheduledRepayment", "optionalRepayment", "availableCash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRepayment: { type: "number" },
    cashShare: { type: "number" },
  },
  required: ["totalRepayment", "cashShare"],
} as const;
/** Report explicit scheduled and optional debt repayments as a share of available cash, retaining over-allocation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledRepayment, optionalRepayment, availableCash } = request;
  const compute = (): Output => {
    H.positive(availableCash);
    H.domain(scheduledRepayment >= 0 && optionalRepayment >= 0);
    return {
      totalRepayment: scheduledRepayment + optionalRepayment,
      cashShare: (scheduledRepayment + optionalRepayment) / availableCash,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledRepayment: 20, optionalRepayment: 10, availableCash: 100 },
  output: { totalRepayment: 30, cashShare: 0.3 },
} satisfies ToolExample<Input, Output>;
export const debtAmortizationSweepShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/debt-amortization-sweep-share",
    title: "Debt Amortization Sweep Share Tool",
    description:
      "Report explicit scheduled and optional debt repayments as a share of available cash, retaining over-allocation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledRepayment: { type: "number", minimum: 0 },
        optionalRepayment: { type: "number", minimum: 0 },
        availableCash: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["scheduledRepayment", "optionalRepayment", "availableCash"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRepayment: { type: "number" },
        cashShare: { type: "number" },
      },
      required: ["totalRepayment", "cashShare"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledRepayment",
          label: "Scheduled Repayment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "optionalRepayment",
          label: "Optional Repayment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableCash",
          label: "Available Cash",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalRepayment",
          label: "Total Repayment",
          valueType: { type: "number" },
        },
        { id: "cashShare", label: "Cash Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = debtAmortizationSweepShareTool.execute;
export default debtAmortizationSweepShareTool;
