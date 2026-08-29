import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      footLength: 27,
      footWidth: 10,
    },
  },
  output: {
    kind: "roller-skate",
    measurementsCm: {
      footLength: 27,
      footWidth: 10,
    },
    primary: "Measurement-based fit profile",
    equivalents: ["Foot length: 27 cm / 10.6 in", "Foot width: 10 cm / 3.9 in"],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
