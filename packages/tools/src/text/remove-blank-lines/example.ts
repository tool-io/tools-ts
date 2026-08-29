import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "First line\n\nSecond line",
  },
  output: {
    text: "First line\nSecond line",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
