import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    hex: "48656c6c6f",
  },
  output: {
    bytes: "SGVsbG8=",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
