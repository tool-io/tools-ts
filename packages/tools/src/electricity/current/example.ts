import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    resistance: 4,
    voltage: 12,
  },
  output: {
    current: 3,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
