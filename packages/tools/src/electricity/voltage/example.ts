import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    current: 3,
    resistance: 4,
  },
  output: {
    voltage: 12,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
