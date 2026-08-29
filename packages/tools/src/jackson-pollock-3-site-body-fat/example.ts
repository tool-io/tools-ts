import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    ageYears: 35,
    sex: "female",
    skinfoldsMm: [18, 22, 20],
  },
  output: {
    bodyDensityGPerCm3: 1.0433261,
    bodyFatPercent: 24.444183846258625,
    skinfoldSumMm: 60,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
