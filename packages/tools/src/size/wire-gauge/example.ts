import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      diameter: 0.205,
    },
  },
  output: {
    kind: "wire-gauge",
    measurementsCm: {
      diameter: 0.205,
    },
    primary: "Measured specification",
    equivalents: ["Conductor diameter: 0.2 cm / 0.1 in"],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
