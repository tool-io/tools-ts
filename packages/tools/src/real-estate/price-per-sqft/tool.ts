import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PricePerSqftInput = Readonly<{
  readonly purchasePrice: number;
  readonly areaSquareFeet: number;
}>;
export type PricePerSqftOutput = Readonly<{
  readonly pricePerSquareFoot: number;
}>;

export const calculatePricePerSqft = (
  x: PricePerSqftInput,
): PricePerSqftOutput => {
  if (!Number.isFinite(x.purchasePrice) || x.purchasePrice < 0)
    simpleError("purchasePrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.areaSquareFeet) || x.areaSquareFeet <= 0)
    simpleError("areaSquareFeet", "Provide a finite positive number.");
  const pricePerSquareFoot = x.purchasePrice / x.areaSquareFeet;
  if (!Number.isFinite(pricePerSquareFoot))
    simpleError(
      "pricePerSquareFoot",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pricePerSquareFoot: Object.is(pricePerSquareFoot, -0)
      ? 0
      : pricePerSquareFoot,
  };
};

export const example = {
  input: {
    purchasePrice: 200000,
    areaSquareFeet: 2000,
  },
  output: { pricePerSquareFoot: 100 },
} satisfies ToolExample<PricePerSqftInput, PricePerSqftOutput>;

export const tool = createSimpleTool({
  id: "real-estate/price-per-sqft",
  title: "Price Per Sqft",
  description:
    "Property purchase price per square foot of the measured floor area.",
  inputs: [
    {
      id: "purchasePrice",
      kind: "number",
      label: "Purchase Price",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "areaSquareFeet",
      kind: "number",
      label: "Area Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pricePerSquareFoot",
      kind: "number",
      label: "Price Per Square Foot",
      unit: "currency/ft2",
    },
  ],
  calculate: (input) =>
    calculatePricePerSqft({
      purchasePrice: input.purchasePrice as number,
      areaSquareFeet: input.areaSquareFeet as number,
    }),
});
export const pricePerSqftTool = tool;
export const runPricePerSqft = tool.execute;
export default tool;
