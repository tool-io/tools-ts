import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      inseam: 82,
      height: 178,
    },
  },
  output: {
    kind: "bicycle-frame",
    measurementsCm: {
      inseam: 82,
      height: 178,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Cycling inseam: 82 cm / 32.3 in",
      "Body height: 178 cm / 70.1 in",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
