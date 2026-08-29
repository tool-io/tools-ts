import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 42,
  },
  output: {
    even: true,
    parity: "even",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
