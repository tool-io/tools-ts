import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      neck: 38,
      ease: 3,
    },
  },
  output: {
    kind: "dog-collar",
    measurementsCm: {
      neck: 38,
      ease: 3,
    },
    primary: "41 cm collar setting",
    equivalents: ["Neck 38 cm", "Allowance 3 cm"],
    warning:
      "Confirm the manufacturer’s measuring point and check that the collar cannot slip over the head or restrict breathing.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
