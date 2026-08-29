import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    endingValue: 1210,
    startingValue: 1000,
    years: 2,
  },
  output: {
    annualizedReturn: 0.10000000000000009,
    annualizedReturnPercent: 10.000000000000009,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
