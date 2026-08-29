import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: ["red", "green", "blue"],
    second: ["green", "yellow"],
  },
  output: {
    values: ["red", "green", "blue", "yellow"],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
