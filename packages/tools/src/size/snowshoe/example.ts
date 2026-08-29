import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      bootLength: 31,
      bodyWeight: 85,
    },
  },
  output: {
    kind: "snowshoe",
    measurementsCm: {
      bootLength: 31,
      bodyWeight: 85,
    },
    primary: "Measurement-based fit profile",
    equivalents: [
      "Boot outsole length: 31 cm / 12.2 in",
      "Body weight including gear: 85 kg / 187.4 lb",
    ],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
