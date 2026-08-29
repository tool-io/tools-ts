import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    octal: "52",
  },
  output: {
    decimal: 42,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
