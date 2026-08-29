import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    heightCm: 175,
    resistanceOhms: 500,
  },
  output: {
    impedanceIndexCm2PerOhm: 61.25,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
