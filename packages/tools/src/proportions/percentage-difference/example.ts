import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: 80,
    second: 100,
  },
  output: {
    percentDifference: 22.22222222222222,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
