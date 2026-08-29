import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    k: 2,
    n: 5,
  },
  output: {
    combinations: 10,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
