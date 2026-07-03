import { createSimpleTool, simpleError } from "../../core/simple.js";
export const cumulativeProductTool = createSimpleTool({
  id: "list/cumulative-product",
  title: "Cumulative Product Calculator",
  description: "Calculate successive products across a numeric list.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    { id: "products", label: "Cumulative products", kind: "numberList" },
  ],
  calculate: (input) => {
    let product = 1;
    const products = (input.values as number[]).map((value) => {
      product *= value;
      if (!Number.isFinite(product))
        simpleError("values", "A cumulative product is not finite.");
      return product;
    });
    return { products };
  },
});
export const runCumulativeProduct = cumulativeProductTool.execute;
export default cumulativeProductTool;
