import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 12345,
  },
  output: {
    digits: 5,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
