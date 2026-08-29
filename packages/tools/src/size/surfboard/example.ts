import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 178,
      bodyWeight: 80,
    },
  },
  output: {
    kind: "surfboard",
    measurementsCm: {
      height: 178,
      bodyWeight: 80,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Body height: 178 cm / 70.1 in",
      "Body weight: 80 kg / 176.4 lb",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
