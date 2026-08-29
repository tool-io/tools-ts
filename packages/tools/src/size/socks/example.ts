import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      footLength: 27,
    },
  },
  output: {
    kind: "socks",
    measurementsCm: {
      footLength: 27,
    },
    primary: "Sock L",
    equivalents: [
      "Foot length 27 cm",
      "Approx. EU shoe 43",
      "Approx. US men 10",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
