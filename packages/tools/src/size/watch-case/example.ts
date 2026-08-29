import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      wrist: 17,
      caseDiameter: 4,
    },
  },
  output: {
    kind: "watch-case",
    measurementsCm: {
      wrist: 17,
      caseDiameter: 4,
    },
    primary: "Measured specification",
    equivalents: [
      "Wrist circumference: 17 cm / 6.7 in",
      "Preferred case diameter: 4 cm / 1.6 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
