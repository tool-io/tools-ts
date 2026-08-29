import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      childHeight: 105,
      childWeight: 18,
    },
  },
  output: {
    kind: "child-car-seat",
    measurementsCm: {
      childHeight: 105,
      childWeight: 18,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Child height: 105 cm / 41.3 in",
      "Child weight: 18 kg / 39.7 lb",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
