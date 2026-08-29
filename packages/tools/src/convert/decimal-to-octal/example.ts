import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    decimal: 42,
  },
  output: {
    octal: "52",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
