import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 12321,
  },
  output: {
    palindrome: true,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
