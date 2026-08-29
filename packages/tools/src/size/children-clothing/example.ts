import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 128,
      chest: 66,
      waist: 58,
    },
  },
  output: {
    kind: "children-clothing",
    measurementsCm: {
      height: 128,
      chest: 66,
      waist: 58,
    },
    primary: "Height size 128",
    equivalents: ["Body height 128 cm", "Body height 50.4 in"],
    warning:
      "Children’s labels may also use age, but body height is the more useful starting measurement. Check the maker’s chart and allow for movement and growth.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
