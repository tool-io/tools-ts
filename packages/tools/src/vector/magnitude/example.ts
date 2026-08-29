import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    vector: [1, 2, 3],
  },
  output: {
    magnitude: 3.741657386773941,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
