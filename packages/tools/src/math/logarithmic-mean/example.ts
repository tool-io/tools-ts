import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: 2,
    second: 8,
  },
  output: {
    logarithmicMean: 4.3280851226668915,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
