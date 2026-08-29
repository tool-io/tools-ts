import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      diameter: 0.6,
      length: 4,
    },
  },
  output: {
    kind: "screw",
    measurementsCm: {
      diameter: 0.6,
      length: 4,
    },
    primary: "Measured specification",
    equivalents: [
      "Nominal diameter: 0.6 cm / 0.2 in",
      "Screw length: 4 cm / 1.6 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
