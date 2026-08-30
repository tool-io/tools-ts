import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly writtenPremium: number;
  readonly frontingFeePercent: number;
  readonly minimumFee: number;
  readonly collateralCost: number;
}>;
export type Output = Readonly<{
  readonly percentageFee: number;
  readonly frontingFee: number;
  readonly totalArrangementCost: number;
  readonly effectiveCostPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.writtenPremium <= 0)
    simpleError(
      "writtenPremium",
      "Written premium must be positive.",
      "invalid_premium",
    );
  const percentageFee = (input.writtenPremium * input.frontingFeePercent) / 100,
    frontingFee = Math.max(percentageFee, input.minimumFee);
  return {
    percentageFee,
    frontingFee,
    totalArrangementCost: frontingFee + input.collateralCost,
    effectiveCostPercent:
      ((frontingFee + input.collateralCost) / input.writtenPremium) * 100,
  };
};

export const exampleInput = {
  writtenPremium: 1000000,
  frontingFeePercent: 5,
  minimumFee: 40000,
  collateralCost: 10000,
} satisfies Input;
export const exampleOutput = {
  percentageFee: 50000,
  frontingFee: 50000,
  totalArrangementCost: 60000,
  effectiveCostPercent: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      writtenPremium: input.writtenPremium as number,
      frontingFeePercent: input.frontingFeePercent as number,
      minimumFee: input.minimumFee as number,
      collateralCost: input.collateralCost as number,
    }),
  description:
    "Calculate fronting fees and collateral costs as a share of premium.",
  id: "insurance/fronting-fee",
  inputs: [
    {
      id: "writtenPremium",
      label: "Written premium",
      kind: "number",
      minimum: 0,
    },
    {
      id: "frontingFeePercent",
      label: "Fronting fee rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "minimumFee", label: "Minimum fee", kind: "number", minimum: 0 },
    {
      id: "collateralCost",
      label: "Collateral cost",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "percentageFee",
      label: "Percentage-based fronting fee",
      kind: "number",
      minimum: 0,
    },
    {
      id: "frontingFee",
      label: "Applied fronting fee",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalArrangementCost",
      label: "Total arrangement cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "effectiveCostPercent",
      label: "Effective cost",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Fronting Fee",
});

export const run = tool.execute;
export default tool;
