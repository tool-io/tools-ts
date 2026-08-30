import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly monthlyVolume: number;
  readonly transactionCount: number;
  readonly interchangePercent: number;
  readonly markupPercent: number;
  readonly perTransactionFee: number;
  readonly blendedPercent: number;
}>;
export type Output = Readonly<{
  readonly interchangePlusCost: number;
  readonly blendedCost: number;
  readonly lowerCostModel: string;
}>;

export const calculate = (input: Input): Output => {
  const interchangePlusCost =
    (input.monthlyVolume * (input.interchangePercent + input.markupPercent)) /
      100 +
    input.transactionCount * input.perTransactionFee;
  const blendedCost = (input.monthlyVolume * input.blendedPercent) / 100;
  return {
    interchangePlusCost,
    blendedCost,
    lowerCostModel:
      interchangePlusCost === blendedCost
        ? "tie"
        : interchangePlusCost < blendedCost
          ? "interchange-plus"
          : "blended",
  };
};

export const exampleInput = {
  monthlyVolume: 100000,
  transactionCount: 1000,
  interchangePercent: 1.8,
  markupPercent: 0.3,
  perTransactionFee: 0.1,
  blendedPercent: 2.4,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  monthlyVolume: 0,
  transactionCount: 0,
  interchangePercent: 1.8,
  markupPercent: 0.3,
  perTransactionFee: 0.1,
  blendedPercent: 2.4,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      monthlyVolume: input.monthlyVolume as number,
      transactionCount: input.transactionCount as number,
      interchangePercent: input.interchangePercent as number,
      markupPercent: input.markupPercent as number,
      perTransactionFee: input.perTransactionFee as number,
      blendedPercent: input.blendedPercent as number,
    }),
  description:
    "Compare caller-supplied interchange-plus and blended merchant-pricing terms.",
  id: "banking/merchant-pricing-comparison",
  inputs: [
    {
      id: "monthlyVolume",
      label: "Monthly card volume",
      kind: "number",
      minimum: 0,
      unit: "currency/month",
    },
    {
      id: "transactionCount",
      label: "Transaction count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "interchangePercent",
      label: "Interchange cost",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "markupPercent",
      label: "Markup",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "perTransactionFee",
      label: "Per-transaction fee",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "blendedPercent",
      label: "Blended price",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "interchangePlusCost",
      label: "Interchange-plus cost",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "blendedCost",
      label: "Blended cost",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "lowerCostModel",
      label: "Lower-cost model",
      kind: "string",
      enum: ["interchange-plus", "blended", "tie"],
    },
  ],
  title: "Merchant Pricing Comparison",
});

export const run = tool.execute;
export default tool;
