import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    matrix: [
      [1, 2],
      [3, 4],
    ],
    scalar: 2,
  },
  output: {
    matrix: [
      [2, 4],
      [6, 8],
    ],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
