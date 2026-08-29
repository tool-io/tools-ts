import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    end: 10,
    parameter: 0.4,
    start: 0,
  },
  output: {
    value: 4,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
