import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      hand: 21,
    },
  },
  output: {
    kind: "bangle",
    measurementsCm: {
      hand: 21,
    },
    primary: "6.7 cm minimum inner diameter",
    equivalents: ["Hand circumference 21 cm", "2.6 in inner diameter"],
    warning:
      "Rigid bangles must pass over the widest compressed part of the hand. Hinged bangles may use wrist measurements instead.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
