import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    totalMinutes: 90,
  },
  output: {
    hours: 1,
    minutes: 30,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
