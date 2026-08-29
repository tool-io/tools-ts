import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    firstX: 4,
    firstY: 12,
    secondX: 6,
  },
  output: {
    secondY: 8,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
