import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    onto: [1, 0],
    vector: [3, 4],
  },
  output: {
    vector: [3, 0],
    scalar: 3,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
