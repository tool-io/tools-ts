import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    falseNegative: 10,
    falsePositive: 5,
    trueNegative: 45,
    truePositive: 40,
  },
  output: {
    accuracy: 0.85,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
