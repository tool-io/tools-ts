import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly singlePremium: number;
  readonly annualPayoutRatePercent: number;
  readonly guaranteeYears: number;
}>;
export type Output = Readonly<{
  readonly annualPayout: number;
  readonly monthlyPayout: number;
  readonly guaranteedPayoutTotal: number;
  readonly guaranteedReturnPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.singlePremium <= 0)
    simpleError(
      "singlePremium",
      "Single premium must be positive.",
      "invalid_premium",
    );
  const annualPayout =
      (input.singlePremium * input.annualPayoutRatePercent) / 100,
    guaranteedPayoutTotal = annualPayout * input.guaranteeYears;
  return {
    annualPayout,
    monthlyPayout: annualPayout / 12,
    guaranteedPayoutTotal,
    guaranteedReturnPercent:
      (guaranteedPayoutTotal / input.singlePremium) * 100,
  };
};

export const exampleInput = {
  singlePremium: 100000,
  annualPayoutRatePercent: 6,
  guaranteeYears: 10,
} satisfies Input;
export const exampleOutput = {
  annualPayout: 6000,
  monthlyPayout: 500,
  guaranteedPayoutTotal: 60000,
  guaranteedReturnPercent: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      singlePremium: input.singlePremium as number,
      annualPayoutRatePercent: input.annualPayoutRatePercent as number,
      guaranteeYears: input.guaranteeYears as number,
    }),
  description:
    "Calculate modeled SPIA payout from a caller-supplied payout rate.",
  id: "insurance/spia-payout",
  inputs: [
    {
      id: "singlePremium",
      label: "Single premium",
      kind: "number",
      minimum: 0,
    },
    {
      id: "annualPayoutRatePercent",
      label: "Annual payout rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "guaranteeYears",
      label: "Guarantee period",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
  ],
  outputs: [
    {
      id: "annualPayout",
      label: "Annual SPIA payout",
      kind: "number",
      minimum: 0,
    },
    {
      id: "monthlyPayout",
      label: "Monthly SPIA payout",
      kind: "number",
      minimum: 0,
    },
    {
      id: "guaranteedPayoutTotal",
      label: "Guaranteed payout total",
      kind: "number",
      minimum: 0,
    },
    {
      id: "guaranteedReturnPercent",
      label: "Guaranteed payout as premium share",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "SPIA Payout",
});

export const run = tool.execute;
export default tool;
