import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    newValue: 80,
    originalValue: 100,
  },
  output: {
    percentDecrease: 20,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
