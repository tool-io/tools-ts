import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 12030,
  },
  output: {
    reversed: 3021,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
