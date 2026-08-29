import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      lensWidth: 5.2,
      bridgeWidth: 1.8,
      templeLength: 14,
    },
  },
  output: {
    kind: "sunglasses",
    measurementsCm: {
      lensWidth: 5.2,
      bridgeWidth: 1.8,
      templeLength: 14,
    },
    primary: "Measured specification",
    equivalents: [
      "Lens width: 5.2 cm / 2 in",
      "Bridge width: 1.8 cm / 0.7 in",
      "Temple length: 14 cm / 5.5 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
