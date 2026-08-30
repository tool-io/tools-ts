import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expectedYield: number;
  readonly actualYield: number;
  readonly priceElection: number;
  readonly coveragePercent: number;
  readonly actualMarketPrice: number;
}>;
export type Output = Readonly<{
  readonly yieldGuarantee: number;
  readonly yieldProtectionIndemnity: number;
  readonly revenueGuarantee: number;
  readonly revenueProtectionIndemnity: number;
  readonly higherIndemnityProduct: string;
}>;

export const calculate = (input: Input): Output => {
  const yieldGuarantee = (input.expectedYield * input.coveragePercent) / 100,
    yieldProtectionIndemnity =
      Math.max(0, yieldGuarantee - input.actualYield) * input.priceElection,
    revenueGuarantee = yieldGuarantee * input.priceElection,
    revenueProtectionIndemnity = Math.max(
      0,
      revenueGuarantee - input.actualYield * input.actualMarketPrice,
    );
  return {
    yieldGuarantee,
    yieldProtectionIndemnity,
    revenueGuarantee,
    revenueProtectionIndemnity,
    higherIndemnityProduct:
      yieldProtectionIndemnity === revenueProtectionIndemnity
        ? "tie"
        : yieldProtectionIndemnity > revenueProtectionIndemnity
          ? "yield"
          : "revenue",
  };
};

export const exampleInput = {
  expectedYield: 100,
  actualYield: 60,
  priceElection: 5,
  coveragePercent: 80,
  actualMarketPrice: 4,
} satisfies Input;
export const exampleOutput = {
  yieldGuarantee: 80,
  yieldProtectionIndemnity: 100,
  revenueGuarantee: 400,
  revenueProtectionIndemnity: 160,
  higherIndemnityProduct: "revenue",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      expectedYield: input.expectedYield as number,
      actualYield: input.actualYield as number,
      priceElection: input.priceElection as number,
      coveragePercent: input.coveragePercent as number,
      actualMarketPrice: input.actualMarketPrice as number,
    }),
  description: "Compare modeled crop yield and revenue protection indemnities.",
  id: "insurance/crop-protection-comparison",
  inputs: [
    {
      id: "expectedYield",
      label: "Expected crop yield",
      kind: "number",
      minimum: 0,
    },
    {
      id: "actualYield",
      label: "Actual crop yield",
      kind: "number",
      minimum: 0,
    },
    {
      id: "priceElection",
      label: "Price election",
      kind: "number",
      minimum: 0,
    },
    {
      id: "coveragePercent",
      label: "Coverage percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "actualMarketPrice",
      label: "Actual market price",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "yieldGuarantee",
      label: "Guaranteed yield",
      kind: "number",
      minimum: 0,
    },
    {
      id: "yieldProtectionIndemnity",
      label: "Yield-protection indemnity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "revenueGuarantee",
      label: "Revenue guarantee",
      kind: "number",
      minimum: 0,
    },
    {
      id: "revenueProtectionIndemnity",
      label: "Revenue-protection indemnity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "higherIndemnityProduct",
      label: "Higher indemnity product",
      kind: "string",
      enum: ["yield", "revenue", "tie"],
    },
  ],
  title: "Crop Protection Comparison",
});

export const run = tool.execute;
export default tool;
