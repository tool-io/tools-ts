import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      pawWidth: 5.5,
      pawLength: 6,
    },
  },
  output: {
    kind: "dog-shoe",
    measurementsCm: {
      pawWidth: 5.5,
      pawLength: 6,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Weight-bearing paw width: 5.5 cm / 2.2 in",
      "Weight-bearing paw length: 6 cm / 2.4 in",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
