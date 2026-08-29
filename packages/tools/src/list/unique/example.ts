import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    values: ["alpha", "beta", "alpha"],
  },
  output: {
    values: ["alpha", "beta"],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
