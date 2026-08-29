import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    start: 0,
    end: 10,
    value: 4,
  },
  output: {
    parameter: 0.4,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
