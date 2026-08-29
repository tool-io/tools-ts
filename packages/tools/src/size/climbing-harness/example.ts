import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 82,
      thigh: 58,
    },
  },
  output: {
    kind: "climbing-harness",
    measurementsCm: {
      waist: 82,
      thigh: 58,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Waist circumference: 82 cm / 32.3 in",
      "Thigh circumference: 58 cm / 22.8 in",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
