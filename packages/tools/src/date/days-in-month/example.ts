import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    year: 2025,
    month: 2,
  },
  output: {
    days: 28,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
