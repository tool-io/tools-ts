import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    year: 2025,
  },
  output: {
    leapYear: false,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
