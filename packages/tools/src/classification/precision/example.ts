import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    falsePositive: 5,
    truePositive: 40,
  },
  output: {
    precision: 0.8888888888888888,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
