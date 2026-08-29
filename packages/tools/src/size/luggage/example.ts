import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 55,
      width: 40,
      depth: 23,
    },
  },
  output: {
    kind: "luggage",
    measurementsCm: {
      height: 55,
      width: 40,
      depth: 23,
    },
    primary: "Measured specification",
    equivalents: [
      "Case height: 55 cm / 21.7 in",
      "Case width: 40 cm / 15.7 in",
      "Case depth: 23 cm / 9.1 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
