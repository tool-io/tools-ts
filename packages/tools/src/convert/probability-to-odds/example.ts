import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    probability: 0.8,
  },
  output: {
    odds: 4.000000000000001,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
