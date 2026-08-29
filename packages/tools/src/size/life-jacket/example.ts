import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 100,
      bodyWeight: 80,
    },
  },
  output: {
    kind: "life-jacket",
    measurementsCm: {
      chest: 100,
      bodyWeight: 80,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Chest circumference: 100 cm / 39.4 in",
      "Body weight: 80 kg / 176.4 lb",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
