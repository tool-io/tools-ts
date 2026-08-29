import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    n: 7,
  },
  output: {
    doubleFactorial: 105,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
