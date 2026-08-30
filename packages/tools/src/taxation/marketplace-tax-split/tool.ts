import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly grossMarketplaceSales: number;
  readonly facilitatorCollectedSharePercent: number;
  readonly taxRatePercent: number;
}>;
export type Output = Readonly<{
  readonly facilitatorSales: number;
  readonly sellerSales: number;
  readonly facilitatorTax: number;
  readonly sellerTax: number;
}>;

export const calculate = (input: Input): Output => {
  const facilitatorSales =
    (input.grossMarketplaceSales * input.facilitatorCollectedSharePercent) /
    100;
  const sellerSales = input.grossMarketplaceSales - facilitatorSales;
  return {
    facilitatorSales,
    sellerSales,
    facilitatorTax: (facilitatorSales * input.taxRatePercent) / 100,
    sellerTax: (sellerSales * input.taxRatePercent) / 100,
  };
};

export const exampleInput = {
  grossMarketplaceSales: 1000,
  facilitatorCollectedSharePercent: 60,
  taxRatePercent: 10,
} satisfies Input;
export const exampleOutput = {
  facilitatorSales: 600,
  sellerSales: 400,
  facilitatorTax: 60,
  sellerTax: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      grossMarketplaceSales: input.grossMarketplaceSales as number,
      facilitatorCollectedSharePercent:
        input.facilitatorCollectedSharePercent as number,
      taxRatePercent: input.taxRatePercent as number,
    }),
  description:
    "Split marketplace sales and tax between facilitator and seller collection.",
  id: "taxation/marketplace-tax-split",
  inputs: [
    {
      id: "grossMarketplaceSales",
      label: "Gross marketplace sales",
      kind: "number",
      minimum: 0,
    },
    {
      id: "facilitatorCollectedSharePercent",
      label: "Facilitator-collected share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "taxRatePercent",
      label: "Sales tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "facilitatorSales",
      label: "Facilitator-collected sales",
      kind: "number",
      minimum: 0,
    },
    {
      id: "sellerSales",
      label: "Seller-collected sales",
      kind: "number",
      minimum: 0,
    },
    {
      id: "facilitatorTax",
      label: "Facilitator tax",
      kind: "number",
      minimum: 0,
    },
    { id: "sellerTax", label: "Seller tax", kind: "number", minimum: 0 },
  ],
  title: "Marketplace Tax Split",
});

export const run = tool.execute;
export default tool;
