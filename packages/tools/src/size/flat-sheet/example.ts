import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      width: 200,
      length: 220,
    },
  },
  output: {
    kind: "flat-sheet",
    measurementsCm: {
      width: 200,
      length: 220,
    },
    primary: "Measured specification",
    equivalents: [
      "Finished width: 200 cm / 78.7 in",
      "Finished length: 220 cm / 86.6 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
