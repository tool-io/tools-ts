import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerLowDeductibleMinor: number;
  readonly callerHighDeductibleMinor: number;
  readonly callerLowDeductibleAnnualPremiumMinor: number;
  readonly callerHighDeductibleAnnualPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly additionalDeductibleExposureMinor: number;
  readonly annualPremiumSavingMinor: number;
  readonly simpleNoClaimBreakevenYears: number;
}>;
const inputFields = [
  {
    id: "callerLowDeductibleMinor",
    label: "Caller low deductible minor",
    kind: "number",
  },
  {
    id: "callerHighDeductibleMinor",
    label: "Caller high deductible minor",
    kind: "number",
  },
  {
    id: "callerLowDeductibleAnnualPremiumMinor",
    label: "Caller low deductible annual premium minor",
    kind: "number",
  },
  {
    id: "callerHighDeductibleAnnualPremiumMinor",
    label: "Caller high deductible annual premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerLowDeductibleMinor,
    input.callerHighDeductibleMinor,
    input.callerLowDeductibleAnnualPremiumMinor,
    input.callerHighDeductibleAnnualPremiumMinor,
  ].forEach((v) => money(v));
  if (input.callerHighDeductibleMinor < input.callerLowDeductibleMinor)
    simpleError("deductible", "Ordered low/high deductibles required.");
  const saving =
    input.callerLowDeductibleAnnualPremiumMinor -
    input.callerHighDeductibleAnnualPremiumMinor;
  positive(saving, "saving");
  return {
    additionalDeductibleExposureMinor:
      input.callerHighDeductibleMinor - input.callerLowDeductibleMinor,
    annualPremiumSavingMinor: saving,
    simpleNoClaimBreakevenYears:
      (input.callerHighDeductibleMinor - input.callerLowDeductibleMinor) /
      saving,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLowDeductibleMinor: 1000,
  callerHighDeductibleMinor: 3000,
  callerLowDeductibleAnnualPremiumMinor: 10000,
  callerHighDeductibleAnnualPremiumMinor: 9000,
} satisfies Input;
export const exampleOutput = {
  additionalDeductibleExposureMinor: 2000,
  annualPremiumSavingMinor: 1000,
  simpleNoClaimBreakevenYears: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/deductible-premium-tradeoff-breakeven-years",
  title: "Deductible Premium Tradeoff Breakeven Years Calculator",
  description:
    "Compare actual deductible quote pair using simple extra-exposure/premium-saving horizon; no claim probability, discounting, risk-adjusted recommendation or coverage equality assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "additionalDeductibleExposureMinor",
      label: "Additional deductible exposure minor",
      kind: "number",
    },
    {
      id: "annualPremiumSavingMinor",
      label: "Annual premium saving minor",
      kind: "number",
    },
    {
      id: "simpleNoClaimBreakevenYears",
      label: "Simple no claim breakeven years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLowDeductibleMinor: value.callerLowDeductibleMinor as number,
      callerHighDeductibleMinor: value.callerHighDeductibleMinor as number,
      callerLowDeductibleAnnualPremiumMinor:
        value.callerLowDeductibleAnnualPremiumMinor as number,
      callerHighDeductibleAnnualPremiumMinor:
        value.callerHighDeductibleAnnualPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
