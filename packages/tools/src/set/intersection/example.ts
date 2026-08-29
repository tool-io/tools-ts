import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: ["red", "green", "blue"],
    second: ["green", "yellow"],
  },
  output: {
    values: ["green"],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
