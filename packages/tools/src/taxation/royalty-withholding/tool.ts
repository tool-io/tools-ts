import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly grossRoyaltyPayment: number;
  readonly treatyWithholdingRatePercent: number;
}>;
export type Output = Readonly<{
  readonly withholdingTax: number;
  readonly netRoyaltyPayment: number;
}>;

export const calculate = (input: Input): Output => {
  const withholdingTax =
    (input.grossRoyaltyPayment * input.treatyWithholdingRatePercent) / 100;
  return {
    withholdingTax,
    netRoyaltyPayment: input.grossRoyaltyPayment - withholdingTax,
  };
};

export const exampleInput = {
  grossRoyaltyPayment: 1000,
  treatyWithholdingRatePercent: 10,
} satisfies Input;
export const exampleOutput = {
  withholdingTax: 100,
  netRoyaltyPayment: 900,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      grossRoyaltyPayment: input.grossRoyaltyPayment as number,
      treatyWithholdingRatePercent:
        input.treatyWithholdingRatePercent as number,
    }),
  description:
    "Calculate royalty withholding from a caller-supplied treaty rate.",
  id: "taxation/royalty-withholding",
  inputs: [
    {
      id: "grossRoyaltyPayment",
      label: "Gross royalty payment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "treatyWithholdingRatePercent",
      label: "Treaty withholding rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "withholdingTax",
      label: "Royalty withholding tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "netRoyaltyPayment",
      label: "Net royalty payment",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Royalty Withholding",
});

export const run = tool.execute;
export default tool;
