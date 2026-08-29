import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    decimal: 42,
  },
  output: {
    hexadecimal: "2A",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
