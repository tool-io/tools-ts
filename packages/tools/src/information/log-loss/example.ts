import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    labels: [1, 0, 1],
    probabilities: [0.9, 0.2, 0.8],
  },
  output: {
    logLoss: 0.18388253942874858,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
