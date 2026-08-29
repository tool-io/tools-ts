import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    vector: [1, 2, 3],
    scalar: 2,
  },
  output: {
    vector: [2, 4, 6],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
