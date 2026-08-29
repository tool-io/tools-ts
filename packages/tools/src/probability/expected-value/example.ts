import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    probabilities: [0.2, 0.3, 0.5],
    values: [10, 20, 30],
  },
  output: {
    expectedValue: 23,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
