import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    densityGPerCm3: 1.05,
  },
  output: {
    bodyFatPercent: 21.428571428571388,
    densityGPerCm3: 1.05,
    equation: "siri",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
