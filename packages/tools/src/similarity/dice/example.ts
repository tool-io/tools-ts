import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: ["red", "green", "blue"],
    second: ["green", "blue", "yellow"],
  },
  output: {
    similarity: 0.6666666666666666,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
