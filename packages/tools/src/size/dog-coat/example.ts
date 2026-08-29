import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 55,
      neck: 38,
      back: 45,
    },
  },
  output: {
    kind: "dog-coat",
    measurementsCm: {
      chest: 55,
      neck: 38,
      back: 45,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Chest girth: 55 cm / 21.7 in",
      "Neck circumference: 38 cm / 15 in",
      "Back length: 45 cm / 17.7 in",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
