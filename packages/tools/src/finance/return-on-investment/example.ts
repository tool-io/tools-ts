import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    cost: 100,
    gain: 125,
  },
  output: {
    netReturn: 25,
    returnPercent: 25,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
