import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    annualRatePercent: 5,
    principal: 1000,
    years: 3,
  },
  output: {
    interest: 150,
    balance: 1150,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
