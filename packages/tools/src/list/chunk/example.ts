import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    values: ["alpha", "beta", "alpha"],
    size: 2,
  },
  output: {
    chunks: {
      values: [["alpha", "beta"], ["alpha"]],
    },
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
