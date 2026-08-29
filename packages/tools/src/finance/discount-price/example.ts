import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    originalPrice: 100,
    discountPercent: 20,
  },
  output: {
    discountAmount: 20,
    finalPrice: 80,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
