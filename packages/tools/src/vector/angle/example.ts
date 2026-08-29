import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    first: [1, 0],
    second: [0, 1],
  },
  output: {
    radians: 1.5707963267948966,
    degrees: 90,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
