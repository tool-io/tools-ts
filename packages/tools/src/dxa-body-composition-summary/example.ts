import type { ToolExample } from "../core/example.js";

export const example = {
  input: {
    boneMineralContentKg: 3,
    fatMassKg: 20,
    leanMassKg: 52,
  },
  output: {
    boneMineralContentPercent: 4,
    fatMassPercent: 26.666666666666668,
    leanMassPercent: 69.33333333333334,
    totalMeasuredMassKg: 75,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
