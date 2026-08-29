import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      width: 152,
      length: 203,
      depth: 30,
    },
  },
  output: {
    kind: "mattress",
    measurementsCm: {
      width: 152,
      length: 203,
      depth: 30,
    },
    primary: "Measured specification",
    equivalents: [
      "Mattress width: 152 cm / 59.8 in",
      "Mattress length: 203 cm / 79.9 in",
      "Mattress depth: 30 cm / 11.8 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
