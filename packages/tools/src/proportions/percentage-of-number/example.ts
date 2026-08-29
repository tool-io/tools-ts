import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    percent: 20,
    value: 250,
  },
  output: {
    result: 50,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
