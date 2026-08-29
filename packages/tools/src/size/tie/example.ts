import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      neck: 40,
      desiredLength: 147,
    },
  },
  output: {
    kind: "tie",
    measurementsCm: {
      neck: 40,
      desiredLength: 147,
    },
    primary: "Measured specification",
    equivalents: [
      "Neck circumference: 40 cm / 15.7 in",
      "Finished tie length: 147 cm / 57.9 in",
    ],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
