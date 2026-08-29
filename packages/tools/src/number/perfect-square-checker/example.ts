import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 144,
  },
  output: {
    perfectSquare: true,
    root: 12,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
