import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    values: ["alpha", "beta", "alpha"],
    positions: 2,
  },
  output: {
    values: ["beta", "alpha", "alpha"],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
