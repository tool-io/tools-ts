import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      width: 21,
      height: 29.7,
    },
  },
  output: {
    kind: "book-format",
    measurementsCm: {
      width: 21,
      height: 29.7,
    },
    primary: "Measured specification",
    equivalents: ["Width: 21 cm / 8.3 in", "Height: 29.7 cm / 11.7 in"],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
