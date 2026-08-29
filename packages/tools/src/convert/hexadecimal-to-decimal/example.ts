import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    hexadecimal: "2A",
  },
  output: {
    decimal: 42,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
