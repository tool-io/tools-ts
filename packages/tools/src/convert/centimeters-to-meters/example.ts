import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    centimeters: 250,
  },
  output: {
    meters: 2.5,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
