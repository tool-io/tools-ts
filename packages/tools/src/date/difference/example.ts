import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    endDate: "2025-02-01",
    startDate: "2025-01-15",
  },
  output: {
    days: 17,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
