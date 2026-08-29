import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    costOfGoodsSold: 60,
    revenue: 100,
  },
  output: {
    grossProfit: 40,
    grossMarginPercent: 40,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
