import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    successes: 7,
    trials: 10,
  },
  output: {
    probability: 0.7,
    percent: 70,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
