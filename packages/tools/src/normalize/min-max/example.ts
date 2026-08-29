import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    values: [1, 2, 3],
    targetMinimum: 0,
    targetMaximum: 1,
  },
  output: {
    values: [0, 0.5, 1],
    sourceMinimum: 1,
    sourceMaximum: 3,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
