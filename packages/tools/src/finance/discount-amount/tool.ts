import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const discountAmountTool = createSimpleTool({
  id: "finance/discount-amount",
  title: "Discount Amount Calculator",
  description:
    "Calculate the monetary discount taken off a price at a percentage rate.",
  inputs: [
    { id: "price", label: "Price", kind: "number", minimum: 0 },
    {
      id: "discountPercent",
      label: "Discount",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [{ id: "discountAmount", label: "Discount amount", kind: "number" }],
  calculate: (input) => {
    return {
      discountAmount:
        ((input.price as number) * (input.discountPercent as number)) / 100,
    };
  },
});
export const runDiscountAmount = discountAmountTool.execute;
export default discountAmountTool;

export type DiscountAmountInput = {
  readonly price: number;
  readonly discountPercent: number;
};

export type DiscountAmountOutput = {
  readonly discountAmount: number;
};

export const discountAmountExample = {
  input: { price: 120, discountPercent: 15 },
  output: { discountAmount: 18 },
} satisfies ToolExample<DiscountAmountInput, DiscountAmountOutput>;
