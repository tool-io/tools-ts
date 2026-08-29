import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    bytes: "SGVsbG8=",
  },
  output: {
    hex: "48656c6c6f",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
