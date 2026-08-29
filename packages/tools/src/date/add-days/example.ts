import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    date: "2025-01-15",
    days: 15,
  },
  output: {
    date: "2025-01-30",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
