import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      diameter: 0.8,
    },
  },
  output: {
    kind: "drill-bit",
    measurementsCm: {
      diameter: 0.8,
    },
    primary: "Measured specification",
    equivalents: ["Bit diameter: 0.8 cm / 0.3 in"],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
