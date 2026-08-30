import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly grossRoyaltyIncome: number;
  readonly taxableIncomeFromProperty: number;
  readonly depletionRatePercent: number;
}>;
export type Output = Readonly<{
  readonly grossIncomeDepletion: number;
  readonly allowedDepletion: number;
}>;

export const calculate = (input: Input): Output => {
  const grossIncomeDepletion =
    (input.grossRoyaltyIncome * input.depletionRatePercent) / 100;
  return {
    grossIncomeDepletion,
    allowedDepletion: Math.min(
      grossIncomeDepletion,
      input.taxableIncomeFromProperty,
    ),
  };
};

export const exampleInput = {
  grossRoyaltyIncome: 100000,
  taxableIncomeFromProperty: 12000,
  depletionRatePercent: 15,
} satisfies Input;
export const exampleOutput = {
  grossIncomeDepletion: 15000,
  allowedDepletion: 12000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      grossRoyaltyIncome: input.grossRoyaltyIncome as number,
      taxableIncomeFromProperty: input.taxableIncomeFromProperty as number,
      depletionRatePercent: input.depletionRatePercent as number,
    }),
  description:
    "Calculate percentage depletion and apply a caller-supplied taxable-income limitation.",
  id: "taxation/royalty-depletion",
  inputs: [
    {
      id: "grossRoyaltyIncome",
      label: "Gross royalty income",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "taxableIncomeFromProperty",
      label: "Taxable income from property",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "depletionRatePercent",
      label: "Depletion rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "grossIncomeDepletion",
      label: "Gross-income depletion",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "allowedDepletion",
      label: "Allowed depletion",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Royalty Depletion",
});

export const run = tool.execute;
export default tool;
