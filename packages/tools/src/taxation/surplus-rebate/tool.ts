import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eligibleTaxLiability: number;
  readonly rebatePercent: number;
  readonly maximumRebate: number;
}>;
export type Output = Readonly<{
  readonly uncappedRebate: number;
  readonly rebateAmount: number;
}>;

export const calculate = (input: Input): Output => {
  const uncappedRebate =
    (input.eligibleTaxLiability * input.rebatePercent) / 100;
  return {
    uncappedRebate,
    rebateAmount: Math.min(uncappedRebate, input.maximumRebate),
  };
};

export const exampleInput = {
  eligibleTaxLiability: 2000,
  rebatePercent: 45,
  maximumRebate: 800,
} satisfies Input;
export const exampleOutput = {
  uncappedRebate: 900,
  rebateAmount: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eligibleTaxLiability: input.eligibleTaxLiability as number,
      rebatePercent: input.rebatePercent as number,
      maximumRebate: input.maximumRebate as number,
    }),
  description:
    "Calculate a surplus rebate using caller-supplied percentage and cap.",
  id: "taxation/surplus-rebate",
  inputs: [
    {
      id: "eligibleTaxLiability",
      label: "Eligible tax liability",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "rebatePercent",
      label: "Rebate percentage",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "maximumRebate",
      label: "Maximum rebate",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "uncappedRebate",
      label: "Uncapped rebate",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "rebateAmount",
      label: "Rebate amount",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Surplus Rebate",
});

export const run = tool.execute;
export default tool;
