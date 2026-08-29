import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      thickness: 5,
      width: 10,
      length: 240,
    },
  },
  output: {
    kind: "lumber",
    measurementsCm: {
      thickness: 5,
      width: 10,
      length: 240,
    },
    primary: "Measured specification",
    equivalents: [
      "Nominal thickness: 5 cm / 2 in",
      "Nominal width: 10 cm / 3.9 in",
      "Board length: 240 cm / 94.5 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
