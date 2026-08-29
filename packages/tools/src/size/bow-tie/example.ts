import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      neck: 39,
    },
  },
  output: {
    kind: "bow-tie",
    measurementsCm: {
      neck: 39,
    },
    primary: "Measured specification",
    equivalents: ["Neck circumference: 39 cm / 15.4 in"],
    warning:
      "Nominal names and manufacturing tolerances vary by standard, country, era, and manufacturer. Match exact dimensions and the relevant product standard before ordering.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
