import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    matrix: [
      [1, 2],
      [3, 4],
    ],
  },
  output: {
    rows: 2,
    columns: 2,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
