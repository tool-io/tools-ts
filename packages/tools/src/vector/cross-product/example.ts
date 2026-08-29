import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: [1, 0, 0],
    second: [0, 1, 0],
  },
  output: {
    vector: [0, 0, 1],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
