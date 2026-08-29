import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: "karolin",
    second: "kathrin",
  },
  output: {
    distance: 3,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
