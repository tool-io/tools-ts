import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ListToSaleRatioInput = Readonly<{
  readonly salePrice: number;
  readonly listPrice: number;
}>;
export type ListToSaleRatioOutput = Readonly<{
  readonly saleToListPercent: number;
}>;

export const calculateListToSaleRatio = (
  x: ListToSaleRatioInput,
): ListToSaleRatioOutput => {
  if (!Number.isFinite(x.salePrice) || x.salePrice < 0)
    simpleError("salePrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.listPrice) || x.listPrice <= 0)
    simpleError("listPrice", "Provide a finite positive number.");
  const saleToListPercent = (100 * x.salePrice) / x.listPrice;
  if (!Number.isFinite(saleToListPercent))
    simpleError(
      "saleToListPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    saleToListPercent: Object.is(saleToListPercent, -0) ? 0 : saleToListPercent,
  };
};

export const example = {
  input: {
    salePrice: 190000,
    listPrice: 200000,
  },
  output: { saleToListPercent: 95 },
} satisfies ToolExample<ListToSaleRatioInput, ListToSaleRatioOutput>;

export const tool = createSimpleTool({
  id: "real-estate/list-to-sale-ratio",
  title: "List To Sale Ratio",
  description: "Sale price as a percentage of final list price.",
  inputs: [
    {
      id: "salePrice",
      kind: "number",
      label: "Sale Price",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "listPrice",
      kind: "number",
      label: "List Price",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "saleToListPercent",
      kind: "number",
      label: "Sale To List Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateListToSaleRatio({
      salePrice: input.salePrice as number,
      listPrice: input.listPrice as number,
    }),
});
export const listToSaleRatioTool = tool;
export const runListToSaleRatio = tool.execute;
export default tool;
