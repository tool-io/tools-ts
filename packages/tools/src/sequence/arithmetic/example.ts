import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    difference: 3,
    firstTerm: 2,
    position: 5,
  },
  output: {
    term: 14,
    sum: 40,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
