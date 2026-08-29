import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      handLength: 11,
    },
  },
  output: {
    kind: "racket-grip",
    measurementsCm: {
      handLength: 11,
    },
    primary: "Measurement-based fit profile",
    equivalents: ["Palm crease to ring-finger tip: 11 cm / 4.3 in"],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
