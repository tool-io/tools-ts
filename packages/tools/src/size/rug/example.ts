import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      width: 160,
      length: 230,
    },
  },
  output: {
    kind: "rug",
    measurementsCm: {
      width: 160,
      length: 230,
    },
    primary: "Measured specification",
    equivalents: ["Rug width: 160 cm / 63 in", "Rug length: 230 cm / 90.6 in"],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
