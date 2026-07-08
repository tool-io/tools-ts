import { createSimpleTool, simpleError } from "../../core/simple.js";
export const pricePerUnitTool = createSimpleTool({
  id: "finance/price-per-unit",
  title: "Price per Unit Calculator",
  description:
    "Calculate the price for one unit from total price and quantity.",
  inputs: [
    { id: "totalPrice", label: "Total price", kind: "number" },
    { id: "quantity", label: "Quantity", kind: "number" },
  ],
  outputs: [{ id: "pricePerUnit", label: "Price per unit", kind: "number" }],
  calculate: (input) => {
    const quantity = input.quantity as number;
    if (quantity <= 0) simpleError("quantity", "Quantity must be positive.");
    return { pricePerUnit: (input.totalPrice as number) / quantity };
  },
});
export const runPricePerUnit = pricePerUnitTool.execute;
export default pricePerUnitTool;
