import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: [4, 5, 6],
    second: [1, 2, 3],
  },
  output: {
    vector: [3, 3, 3],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
