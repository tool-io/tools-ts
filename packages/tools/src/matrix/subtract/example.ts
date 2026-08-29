import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: [
      [5, 6],
      [7, 8],
    ],
    second: [
      [1, 2],
      [3, 4],
    ],
  },
  output: {
    matrix: [
      [4, 4],
      [4, 4],
    ],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
