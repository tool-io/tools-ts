import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    basePay: 500,
    commissionRatePercent: 5,
    sales: 5000,
  },
  output: {
    commission: 250,
    totalCompensation: 750,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
