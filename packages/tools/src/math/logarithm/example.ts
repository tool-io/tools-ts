import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 2,
    base: 10,
  },
  output: {
    logarithm: 0.30102999566398114,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
