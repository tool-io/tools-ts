import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    values: [1, 2, 3],
  },
  output: {
    values: [-1.224744871391589, 0, 1.224744871391589],
    mean: 2,
    standardDeviation: 0.816496580927726,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
