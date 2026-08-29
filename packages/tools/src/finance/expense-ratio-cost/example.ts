import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    assets: 100000,
    expenseRatioPercent: 0.5,
  },
  output: {
    annualCost: 500,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
