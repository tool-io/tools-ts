import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    values: ["alpha", "beta", "alpha"],
  },
  output: {
    frequencies: {
      alpha: 2,
      beta: 1,
    },
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
