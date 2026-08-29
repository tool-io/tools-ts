import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      neck: 34,
      ease: 2,
    },
  },
  output: {
    kind: "choker",
    measurementsCm: {
      neck: 34,
      ease: 2,
    },
    primary: "36 cm choker length",
    equivalents: ["Neck 34 cm", "Ease 2 cm", "14.2 in finished length"],
    warning:
      "A choker must not restrict breathing or swallowing. Add comfort ease and account for the clasp or extender.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
