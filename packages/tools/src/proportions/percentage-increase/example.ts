import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    newValue: 120,
    originalValue: 100,
  },
  output: {
    percentIncrease: 20,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
