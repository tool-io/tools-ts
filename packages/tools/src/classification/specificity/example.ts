import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    falsePositive: 5,
    trueNegative: 45,
  },
  output: {
    specificity: 0.9,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
