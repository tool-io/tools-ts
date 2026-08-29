import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      headWidth: 15,
      headArc: 32,
    },
  },
  output: {
    kind: "headphones",
    measurementsCm: {
      headWidth: 15,
      headArc: 32,
    },
    primary: "Measured specification",
    equivalents: [
      "Head width: 15 cm / 5.9 in",
      "Over-head arc: 32 cm / 12.6 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
