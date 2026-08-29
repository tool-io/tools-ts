import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    gradient: 2,
    learningRate: 0.05,
    parameter: 2,
  },
  output: {
    change: -0.1,
    updatedParameter: 1.9,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
