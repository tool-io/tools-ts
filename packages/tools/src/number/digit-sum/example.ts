import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 12345,
  },
  output: {
    sum: 15,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
