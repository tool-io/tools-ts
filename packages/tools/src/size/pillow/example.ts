import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      width: 50,
      length: 75,
    },
  },
  output: {
    kind: "pillow",
    measurementsCm: {
      width: 50,
      length: 75,
    },
    primary: "Measured specification",
    equivalents: [
      "Pillow width: 50 cm / 19.7 in",
      "Pillow length: 75 cm / 29.5 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
