import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    amount: 120,
    units: 8,
  },
  output: {
    unitRate: 15,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
