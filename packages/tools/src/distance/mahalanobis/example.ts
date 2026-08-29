import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    covariance: [
      [1, 0],
      [0, 1],
    ],
    mean: [0, 0],
    vector: [3, 4],
  },
  output: {
    distance: 5,
    squaredDistance: 25,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
