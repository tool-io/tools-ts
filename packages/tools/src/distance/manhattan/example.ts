import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: [1, 2, 3],
    second: [4, 0, 8],
  },
  output: {
    distance: 10,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
