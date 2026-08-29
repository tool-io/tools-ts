import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    hours: 2,
    minutes: 30,
  },
  output: {
    decimalHours: 2.5,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
