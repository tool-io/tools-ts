import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      tableWidth: 100,
      tableLength: 180,
      desiredDrop: 25,
    },
  },
  output: {
    kind: "tablecloth",
    measurementsCm: {
      tableWidth: 100,
      tableLength: 180,
      desiredDrop: 25,
    },
    primary: "Measured specification",
    equivalents: [
      "Table width: 100 cm / 39.4 in",
      "Table length: 180 cm / 70.9 in",
      "Desired drop per side: 25 cm / 9.8 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
