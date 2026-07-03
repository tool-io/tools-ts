import { createSimpleTool } from "../../core/simple.js";
export const discountPriceTool = createSimpleTool({
  id: "finance/discount-price",
  title: "Discount Price Calculator",
  description:
    "Calculate a discount amount and final price from an original price and percentage.",
  inputs: [
    {
      id: "originalPrice",
      label: "Original price",
      kind: "number",
      minimum: 0,
    },
    {
      id: "discountPercent",
      label: "Discount",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    { id: "discountAmount", label: "Discount amount", kind: "number" },
    { id: "finalPrice", label: "Final price", kind: "number" },
  ],
  calculate: (input) => {
    const discountAmount =
      ((input.originalPrice as number) * (input.discountPercent as number)) /
      100;
    return {
      discountAmount,
      finalPrice: (input.originalPrice as number) - discountAmount,
    };
  },
});
export const runDiscountPrice = discountPriceTool.execute;
export default discountPriceTool;
