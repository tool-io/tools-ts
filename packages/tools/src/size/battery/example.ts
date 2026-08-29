import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      diameter: 1.45,
      length: 5.05,
    },
  },
  output: {
    kind: "battery",
    measurementsCm: {
      diameter: 1.45,
      length: 5.05,
    },
    primary: "Measured specification",
    equivalents: [
      "Cell diameter or width: 1.4 cm / 0.6 in",
      "Cell length or height: 5 cm / 2 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
