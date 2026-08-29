import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    odds: 2,
  },
  output: {
    probability: 0.6666666666666666,
    percent: 66.66666666666666,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
