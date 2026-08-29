import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: 48,
    second: 18,
  },
  output: {
    greatestCommonFactor: 6,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
