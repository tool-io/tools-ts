import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    probability: 0.8,
  },
  output: {
    entropyBits: 0.7219280948873623,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
