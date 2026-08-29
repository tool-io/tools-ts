import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      width: 1.2,
      height: 0.5,
      pitch: 0.254,
    },
  },
  output: {
    kind: "electrical-connector",
    measurementsCm: {
      width: 1.2,
      height: 0.5,
      pitch: 0.254,
    },
    primary: "Measured specification",
    equivalents: [
      "Connector width: 1.2 cm / 0.5 in",
      "Connector height: 0.5 cm / 0.2 in",
      "Contact pitch: 0.3 cm / 0.1 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
