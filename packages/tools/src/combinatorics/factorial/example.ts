import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    n: 5,
  },
  output: {
    factorial: 120,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
