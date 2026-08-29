import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "Hello world",
  },
  output: {
    bytes: "SGVsbG8gd29ybGQ=",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
