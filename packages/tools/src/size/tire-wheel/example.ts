import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      treadWidth: 22.5,
      sidewallHeight: 12.4,
      rimDiameter: 43.2,
    },
  },
  output: {
    kind: "tire-wheel",
    measurementsCm: {
      treadWidth: 22.5,
      sidewallHeight: 12.4,
      rimDiameter: 43.2,
    },
    primary: "Measured specification",
    equivalents: [
      "Tire section width: 22.5 cm / 8.9 in",
      "Sidewall height: 12.4 cm / 4.9 in",
      "Rim diameter: 43.2 cm / 17 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
