import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    probability: 0.8,
  },
  output: {
    complement: 0.19999999999999996,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
