import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    bytes: "SGVsbG8=",
  },
  output: {
    text: "Hello",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
