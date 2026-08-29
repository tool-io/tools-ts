import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      bodyLength: 183,
    },
  },
  output: {
    kind: "horse-blanket",
    measurementsCm: {
      bodyLength: 183,
    },
    primary: "Measurement-based fit profile",
    equivalents: ["Center chest to tail: 183 cm / 72 in"],
    warning:
      "Safety-critical and performance equipment must be checked against the manufacturer’s current fitting instructions. Do not rely on a generic label alone.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
