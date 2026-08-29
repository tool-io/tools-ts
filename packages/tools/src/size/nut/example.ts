import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      threadDiameter: 0.8,
      acrossFlats: 1.3,
    },
  },
  output: {
    kind: "nut",
    measurementsCm: {
      threadDiameter: 0.8,
      acrossFlats: 1.3,
    },
    primary: "Measured specification",
    equivalents: [
      "Nominal thread diameter: 0.8 cm / 0.3 in",
      "Width across flats: 1.3 cm / 0.5 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
