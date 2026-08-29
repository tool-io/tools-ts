import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    part: 25,
    whole: 200,
  },
  output: {
    percent: 12.5,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
