import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description:
    "Calculate glwb withdrawal amount from the supplied measurements.",
  example: { first: 200000, second: 5 },
  first: { id: "benefitBase", label: "Benefit base" },
  formula: "percent-of",
  id: "insurance/glwb-withdrawal-amount",
  output: {
    id: "annualWithdrawalAmount",
    label: "Annual withdrawal",
    unit: "currency/year",
  },
  second: { id: "withdrawalRatePercent", label: "Withdrawal rate" },
  title: "GLWB Withdrawal Amount",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
