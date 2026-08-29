import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    matrix: [
      [1, 2],
      [3, 4],
    ],
  },
  output: {
    trace: 5,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
