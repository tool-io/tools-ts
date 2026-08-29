import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    falseNegative: 10,
    falsePositive: 5,
    truePositive: 40,
  },
  output: {
    f1Score: 0.8421052631578947,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
