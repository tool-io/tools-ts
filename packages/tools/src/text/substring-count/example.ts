import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    substring: "ana",
    text: "banana",
  },
  output: {
    count: 1,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
