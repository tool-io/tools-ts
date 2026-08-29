import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 74,
      chest: 50,
    },
  },
  output: {
    kind: "baby-clothing",
    measurementsCm: {
      height: 74,
      chest: 50,
    },
    primary: "Height size 74",
    equivalents: ["Body height 74 cm", "Body height 29.1 in"],
    warning:
      "Children’s labels may also use age, but body height is the more useful starting measurement. Check the maker’s chart and allow for movement and growth.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
