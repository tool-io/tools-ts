import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    acceptedValue: 100,
    observedValue: 98,
  },
  output: {
    percentError: 2,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
