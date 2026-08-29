import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    position: 10,
  },
  output: {
    triangularNumber: 55,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
