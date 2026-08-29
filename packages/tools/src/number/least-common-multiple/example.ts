import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: 12,
    second: 18,
  },
  output: {
    leastCommonMultiple: 36,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
