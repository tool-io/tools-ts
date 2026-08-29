import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    value: 2,
    width: 2,
  },
  output: {
    formatted: "02",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
