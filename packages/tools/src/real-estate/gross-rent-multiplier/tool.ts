import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrossRentMultiplierInput = {
  readonly purchasePriceUsd: number;
  readonly grossAnnualRentUsd: number;
};

export type GrossRentMultiplierOutput = {
  readonly grossRentMultiplier: number;
};

export const calculateGrossRentMultiplier = (
  input: GrossRentMultiplierInput,
): GrossRentMultiplierOutput => {
  if (!(input.purchasePriceUsd > 0))
    return simpleError(
      "purchasePriceUsd",
      "Purchase price must be greater than zero.",
      "invalid_value",
    );
  if (!(input.grossAnnualRentUsd > 0))
    return simpleError(
      "grossAnnualRentUsd",
      "Gross annual rent must be greater than zero.",
      "invalid_income",
    );
  return {
    grossRentMultiplier: input.purchasePriceUsd / input.grossAnnualRentUsd,
  };
};

export const grossRentMultiplierExample = {
  input: { purchasePriceUsd: 1500000, grossAnnualRentUsd: 180000 },
  output: { grossRentMultiplier: 8.333333333333334 },
} satisfies ToolExample<GrossRentMultiplierInput, GrossRentMultiplierOutput>;

export const grossRentMultiplierTool = createSimpleTool({
  id: "real-estate/gross-rent-multiplier",
  title: "Gross Rent Multiplier Calculator",
  description:
    "Compute the gross rent multiplier of a property from its purchase price and gross annual rent.",
  inputs: [
    {
      description: "Purchase price or property value in US dollars.",
      id: "purchasePriceUsd",
      kind: "number",
      label: "Price",
    },
    {
      description: "Gross annual rent in US dollars.",
      id: "grossAnnualRentUsd",
      kind: "number",
      label: "Gross rent",
    },
  ],
  outputs: [
    {
      description:
        "Gross rent multiplier (price divided by gross annual rent).",
      id: "grossRentMultiplier",
      kind: "number",
      label: "GRM",
    },
  ],
  calculate: (input) =>
    calculateGrossRentMultiplier({
      grossAnnualRentUsd: input.grossAnnualRentUsd as number,
      purchasePriceUsd: input.purchasePriceUsd as number,
    }),
});

export const runGrossRentMultiplier = grossRentMultiplierTool.execute;
export default grossRentMultiplierTool;
