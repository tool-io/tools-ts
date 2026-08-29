import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: [1, 2, 3],
    second: [4, 5, 6],
  },
  output: {
    vector: [5, 7, 9],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
