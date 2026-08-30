import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly netWorth: number;
  readonly averageTaxLiability: number;
  readonly netWorthThreshold: number;
  readonly taxLiabilityThreshold: number;
}>;
export type Output = Readonly<{
  readonly meetsNetWorthThreshold: boolean;
  readonly meetsTaxLiabilityThreshold: boolean;
  readonly thresholdTriggered: boolean;
  readonly netWorthMargin: number;
  readonly taxLiabilityMargin: number;
}>;

export const calculate = (input: Input): Output => {
  const meetsNetWorthThreshold = input.netWorth >= input.netWorthThreshold;
  const meetsTaxLiabilityThreshold =
    input.averageTaxLiability >= input.taxLiabilityThreshold;
  return {
    meetsNetWorthThreshold,
    meetsTaxLiabilityThreshold,
    thresholdTriggered: meetsNetWorthThreshold || meetsTaxLiabilityThreshold,
    netWorthMargin: input.netWorth - input.netWorthThreshold,
    taxLiabilityMargin: input.averageTaxLiability - input.taxLiabilityThreshold,
  };
};

export const exampleInput = {
  netWorth: 200,
  averageTaxLiability: 50,
  netWorthThreshold: 100,
  taxLiabilityThreshold: 100,
} satisfies Input;
export const exampleOutput = {
  meetsNetWorthThreshold: true,
  meetsTaxLiabilityThreshold: false,
  thresholdTriggered: true,
  netWorthMargin: 100,
  taxLiabilityMargin: -50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      netWorth: input.netWorth as number,
      averageTaxLiability: input.averageTaxLiability as number,
      netWorthThreshold: input.netWorthThreshold as number,
      taxLiabilityThreshold: input.taxLiabilityThreshold as number,
    }),
  description:
    "Compare expatriation facts with caller-supplied exit-tax thresholds.",
  id: "taxation/exit-tax-threshold-screen",
  inputs: [
    { id: "netWorth", label: "Net worth", kind: "number", minimum: 0 },
    {
      id: "averageTaxLiability",
      label: "Average tax liability",
      kind: "number",
      minimum: 0,
    },
    {
      id: "netWorthThreshold",
      label: "Caller net-worth threshold",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxLiabilityThreshold",
      label: "Caller tax-liability threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "meetsNetWorthThreshold",
      label: "Meets net-worth threshold",
      kind: "boolean",
    },
    {
      id: "meetsTaxLiabilityThreshold",
      label: "Meets tax-liability threshold",
      kind: "boolean",
    },
    {
      id: "thresholdTriggered",
      label: "At least one supplied threshold triggered",
      kind: "boolean",
    },
    {
      id: "netWorthMargin",
      label: "Net-worth threshold margin",
      kind: "number",
    },
    {
      id: "taxLiabilityMargin",
      label: "Tax-liability threshold margin",
      kind: "number",
    },
  ],
  title: "Exit-Tax Threshold Screen",
});

export const run = tool.execute;
export default tool;
