import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    label: 1,
    probability: 0.8,
  },
  output: {
    crossEntropy: 0.2231435513142097,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
