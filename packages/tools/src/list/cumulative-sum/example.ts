import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    values: [1, 2, 3],
  },
  output: {
    sums: [1, 3, 6],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
