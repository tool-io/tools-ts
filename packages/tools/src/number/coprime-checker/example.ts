import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: 35,
    second: 64,
  },
  output: {
    coprime: true,
    greatestCommonFactor: 1,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
