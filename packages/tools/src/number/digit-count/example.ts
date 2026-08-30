import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: "123456789012345678901234567890",
  },
  output: {
    digits: 30,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
