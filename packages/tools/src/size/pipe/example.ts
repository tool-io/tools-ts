import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      outsideDiameter: 2.69,
      wallThickness: 0.28,
    },
  },
  output: {
    kind: "pipe",
    measurementsCm: {
      outsideDiameter: 2.69,
      wallThickness: 0.28,
    },
    primary: "Measured specification",
    equivalents: [
      "Outside diameter: 2.7 cm / 1.1 in",
      "Wall thickness: 0.3 cm / 0.1 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
