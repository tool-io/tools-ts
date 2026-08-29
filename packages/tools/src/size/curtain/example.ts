import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      panelWidth: 140,
      drop: 240,
    },
  },
  output: {
    kind: "curtain",
    measurementsCm: {
      panelWidth: 140,
      drop: 240,
    },
    primary: "Measured specification",
    equivalents: [
      "Panel width: 140 cm / 55.1 in",
      "Curtain drop: 240 cm / 94.5 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
