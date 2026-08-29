import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    vector: [1, 2, 3],
  },
  output: {
    vector: [0.2672612419124244, 0.5345224838248488, 0.8017837257372733],
    magnitude: 3.741657386773941,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
