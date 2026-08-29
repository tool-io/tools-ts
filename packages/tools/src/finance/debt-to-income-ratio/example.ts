import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    grossMonthlyIncome: 5000,
    monthlyDebt: 1500,
  },
  output: {
    ratio: 0.3,
    percent: 30,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
