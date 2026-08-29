import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "First line\nSecond line\nThird line",
  },
  output: {
    lines: 3,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
