import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: [
      [1, 2],
      [3, 4],
    ],
    second: [
      [5, 6],
      [7, 8],
    ],
  },
  output: {
    matrix: [
      [6, 8],
      [10, 12],
    ],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
