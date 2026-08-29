import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    distance: 2,
    time: 2,
  },
  output: {
    speed: 1,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
