import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 178,
      wristToFloor: 86,
    },
  },
  output: {
    kind: "golf-club",
    measurementsCm: {
      height: 178,
      wristToFloor: 86,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Body height: 178 cm / 70.1 in",
      "Wrist-to-floor distance: 86 cm / 33.9 in",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
