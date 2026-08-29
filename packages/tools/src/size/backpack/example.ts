import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      torsoLength: 48,
      hip: 95,
    },
  },
  output: {
    kind: "backpack",
    measurementsCm: {
      torsoLength: 48,
      hip: 95,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Torso length: 48 cm / 18.9 in",
      "Hip circumference: 95 cm / 37.4 in",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
