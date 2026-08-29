import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    falseNegative: 10,
    truePositive: 40,
  },
  output: {
    recall: 0.8,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
