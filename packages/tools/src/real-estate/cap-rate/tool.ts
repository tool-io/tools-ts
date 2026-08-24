import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapRateInput = {
  readonly annualNetOperatingIncomeUsd: number;
  readonly propertyValueUsd: number;
};

export type CapRateOutput = {
  readonly capitalizationRatePercent: number;
};

export const calculateCapRate = (input: CapRateInput): CapRateOutput => {
  if (!(input.propertyValueUsd > 0))
    return simpleError(
      "propertyValueUsd",
      "Property value must be greater than zero.",
      "invalid_value",
    );
  return {
    capitalizationRatePercent:
      (input.annualNetOperatingIncomeUsd / input.propertyValueUsd) * 100,
  };
};

export const capRateExample = {
  input: { annualNetOperatingIncomeUsd: 120000, propertyValueUsd: 1500000 },
  output: { capitalizationRatePercent: 8 },
} satisfies ToolExample<CapRateInput, CapRateOutput>;

export const capRateTool = createSimpleTool({
  id: "real-estate/cap-rate",
  title: "Cap Rate Calculator",
  description:
    "Compute the real-estate capitalization rate from annual net operating income and property value.",
  inputs: [
    {
      description: "Annual net operating income in US dollars.",
      id: "annualNetOperatingIncomeUsd",
      kind: "number",
      label: "NOI",
    },
    {
      description: "Property value or purchase price in US dollars.",
      id: "propertyValueUsd",
      kind: "number",
      label: "Property value",
    },
  ],
  outputs: [
    {
      description: "Capitalization rate in percent per year.",
      id: "capitalizationRatePercent",
      kind: "number",
      label: "Cap rate",
    },
  ],
  calculate: (input) =>
    calculateCapRate({
      annualNetOperatingIncomeUsd: input.annualNetOperatingIncomeUsd as number,
      propertyValueUsd: input.propertyValueUsd as number,
    }),
});

export const runCapRate = capRateTool.execute;
export default capRateTool;
