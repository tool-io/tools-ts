import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    totalPrice: 100,
    quantity: 2,
  },
  output: {
    pricePerUnit: 50,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
