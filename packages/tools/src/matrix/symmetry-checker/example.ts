import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    matrix: [
      [1, 2],
      [2, 4],
    ],
  },
  output: {
    symmetric: true,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
