import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    loanAmount: 80,
    propertyValue: 100,
  },
  output: {
    ratio: 0.8,
    percent: 80,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
