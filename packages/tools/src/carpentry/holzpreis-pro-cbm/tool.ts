import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const woodPricePerCbmExample = {
  input: { totalPriceEur: 600, volumeCbm: 2 },
  output: { pricePerCbmEur: 300 },
} satisfies ToolExample<
  { readonly totalPriceEur: number; readonly volumeCbm: number },
  { readonly pricePerCbmEur: number }
>;

export const woodPricePerCbmTool = createSimpleTool({
  id: "carpentry/holzpreis-pro-cbm",
  title: "Wood Price per CBM Calculator",
  description:
    "Compute the price per cubic meter of wood from total price and volume.",
  inputs: [
    {
      description: "Total purchase price in euros.",
      id: "totalPriceEur",
      kind: "number",
      label: "Total price",
      unit: "EUR",
    },
    {
      description: "Wood volume in cubic meters.",
      id: "volumeCbm",
      kind: "number",
      label: "Volume",
      unit: "m³",
    },
  ],
  outputs: [
    {
      description: "Price per cubic meter in euros.",
      id: "pricePerCbmEur",
      kind: "number",
      label: "Price per cbm",
      unit: "EUR/m³",
    },
  ],
  calculate: (input) => {
    const totalPriceEur = input.totalPriceEur as number;
    const volumeCbm = input.volumeCbm as number;
    if (totalPriceEur <= 0)
      simpleError(
        "totalPriceEur",
        "Total price must be positive.",
        "must_be_positive",
      );
    if (volumeCbm <= 0)
      simpleError("volumeCbm", "Volume must be positive.", "must_be_positive");
    return { pricePerCbmEur: totalPriceEur / volumeCbm };
  },
});
export const runWoodPricePerCbm = woodPricePerCbmTool.execute;
export default woodPricePerCbmTool;
