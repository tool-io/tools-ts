import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly taxablePremium: number;
  readonly taxRatePercent: number;
  readonly stampingFeePercent: number;
  readonly fixedFees: number;
}>;
export type Output = Readonly<{
  readonly taxAmount: number;
  readonly stampingFee: number;
  readonly totalDue: number;
}>;

export const calculate = (input: Input): Output => {
  const taxAmount = (input.taxablePremium * input.taxRatePercent) / 100;
  const stampingFee = (input.taxablePremium * input.stampingFeePercent) / 100;
  return {
    taxAmount,
    stampingFee,
    totalDue: taxAmount + stampingFee + input.fixedFees,
  };
};

export const exampleInput = {
  taxablePremium: 10000,
  taxRatePercent: 3,
  stampingFeePercent: 0.2,
  fixedFees: 5,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  taxablePremium: 0,
  taxRatePercent: 3,
  stampingFeePercent: 0.2,
  fixedFees: 0,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      taxablePremium: input.taxablePremium as number,
      taxRatePercent: input.taxRatePercent as number,
      stampingFeePercent: input.stampingFeePercent as number,
      fixedFees: input.fixedFees as number,
    }),
  description:
    "Calculate surplus-lines tax and fees from caller-supplied jurisdictional rates.",
  id: "insurance/surplus-lines-tax",
  inputs: [
    {
      id: "taxablePremium",
      label: "Taxable premium",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "taxRatePercent",
      label: "Tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "stampingFeePercent",
      label: "Stamping fee rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "fixedFees",
      label: "Fixed fees",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "taxAmount",
      label: "Tax amount",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "stampingFee",
      label: "Stamping fee",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "totalDue",
      label: "Total due",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Surplus Lines Tax",
});

export const run = tool.execute;
export default tool;
