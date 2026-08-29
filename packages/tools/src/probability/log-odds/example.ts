import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    probability: 0.8,
  },
  output: {
    logOdds: 1.3862943611198908,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
