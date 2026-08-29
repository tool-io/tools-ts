import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      seat: 43,
      thigh: 48,
    },
  },
  output: {
    kind: "saddle",
    measurementsCm: {
      seat: 43,
      thigh: 48,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Seat length: 43 cm / 16.9 in",
      "Upper-leg length: 48 cm / 18.9 in",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
