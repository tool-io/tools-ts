import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    dividend: 42,
    divisor: 7,
  },
  output: {
    divisible: true,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
