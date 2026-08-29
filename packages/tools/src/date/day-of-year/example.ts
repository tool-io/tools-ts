import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    date: "2025-01-15",
  },
  output: {
    dayOfYear: 15,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
