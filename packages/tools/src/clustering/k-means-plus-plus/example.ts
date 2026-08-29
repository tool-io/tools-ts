import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    clusters: 2,
    points: [
      [1, 1],
      [1, 2],
      [8, 8],
      [9, 8],
    ],
  },
  output: {
    centroidIndices: [1, 2],
    centroids: [
      [1, 2],
      [8, 8],
    ],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
