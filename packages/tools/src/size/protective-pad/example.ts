import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      joint: 36,
    },
  },
  output: {
    kind: "protective-pad",
    measurementsCm: {
      joint: 36,
    },
    primary: "Measurement-based fit profile",
    equivalents: ["Joint circumference: 36 cm / 14.2 in"],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
