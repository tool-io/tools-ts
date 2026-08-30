import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly contributionValue: number;
  readonly annualAnnuity: number;
  readonly annualDiscountRatePercent: number;
  readonly termYears: number;
}>;
export type Output = Readonly<{
  readonly annuityPresentValue: number;
  readonly taxableRemainderValue: number;
}>;

export const calculate = (input: Input): Output => {
  const r = input.annualDiscountRatePercent / 100;
  const annuityPresentValue =
    r === 0
      ? input.annualAnnuity * input.termYears
      : (input.annualAnnuity * (1 - (1 + r) ** -input.termYears)) / r;
  return {
    annuityPresentValue,
    taxableRemainderValue: Math.max(
      0,
      input.contributionValue - annuityPresentValue,
    ),
  };
};

export const exampleInput = {
  contributionValue: 1000,
  annualAnnuity: 100,
  annualDiscountRatePercent: 0,
  termYears: 5,
} satisfies Input;
export const exampleOutput = {
  annuityPresentValue: 500,
  taxableRemainderValue: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      contributionValue: input.contributionValue as number,
      annualAnnuity: input.annualAnnuity as number,
      annualDiscountRatePercent: input.annualDiscountRatePercent as number,
      termYears: input.termYears as number,
    }),
  description:
    "Model a GRAT taxable remainder from caller-supplied annuity and discount assumptions.",
  id: "taxation/grat-remainder-value",
  inputs: [
    {
      id: "contributionValue",
      label: "GRAT contribution value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "annualAnnuity",
      label: "Annual annuity",
      kind: "number",
      minimum: 0,
    },
    {
      id: "annualDiscountRatePercent",
      label: "Annual discount rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "termYears",
      label: "GRAT term",
      kind: "integer",
      minimum: 1,
      unit: "years",
    },
  ],
  outputs: [
    {
      id: "annuityPresentValue",
      label: "Annuity present value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxableRemainderValue",
      label: "Modeled taxable remainder",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "GRAT Remainder Value",
});

export const run = tool.execute;
export default tool;
