import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    firstTerm: 2,
    position: 5,
    ratio: 3,
  },
  output: {
    term: 162,
    sum: 242,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
