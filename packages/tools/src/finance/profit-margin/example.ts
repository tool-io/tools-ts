import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    cost: 60,
    revenue: 100,
  },
  output: {
    profit: 40,
    profitMarginPercent: 40,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
