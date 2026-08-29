import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    bodyMassKg: 75,
    correctedBodyVolumeL: 72,
  },
  output: {
    bodyDensityGPerCm3: 1.0416666666666667,
    bodyFatPercent: 25.19999999999999,
    equation: "siri",
    estimatedFatFreeMassKg: 56.10000000000001,
    estimatedFatMassKg: 18.89999999999999,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
