import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    size: 2,
  },
  output: {
    matrix: [
      [1, 0],
      [0, 1],
    ],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
