import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly basePremium: number;
  readonly mitigationCreditPercents: readonly number[];
  readonly maximumCombinedCreditPercent: number;
}>;
export type Output = Readonly<{
  readonly rawCombinedCreditPercent: number;
  readonly appliedCreditPercent: number;
  readonly premiumCredit: number;
  readonly mitigatedPremium: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.mitigationCreditPercents.some((value) => value < 0))
    simpleError(
      "mitigationCreditPercents",
      "Credits must be nonnegative.",
      "invalid_credits",
    );
  const rawCombinedCreditPercent = input.mitigationCreditPercents.reduce(
      (a, b) => a + b,
      0,
    ),
    appliedCreditPercent = Math.min(
      rawCombinedCreditPercent,
      input.maximumCombinedCreditPercent,
    ),
    premiumCredit = (input.basePremium * appliedCreditPercent) / 100;
  return {
    rawCombinedCreditPercent,
    appliedCreditPercent,
    premiumCredit,
    mitigatedPremium: input.basePremium - premiumCredit,
  };
};

export const exampleInput = {
  basePremium: 2000,
  mitigationCreditPercents: [5, 10, 8],
  maximumCombinedCreditPercent: 20,
} satisfies Input;
export const exampleOutput = {
  rawCombinedCreditPercent: 23,
  appliedCreditPercent: 20,
  premiumCredit: 400,
  mitigatedPremium: 1600,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      basePremium: input.basePremium as number,
      mitigationCreditPercents:
        input.mitigationCreditPercents as readonly number[],
      maximumCombinedCreditPercent:
        input.maximumCombinedCreditPercent as number,
    }),
  description:
    "Apply wind-mitigation credits subject to a caller-supplied cap.",
  id: "insurance/wind-mitigation-credit",
  inputs: [
    { id: "basePremium", label: "Base premium", kind: "number", minimum: 0 },
    {
      id: "mitigationCreditPercents",
      label: "Mitigation credits",
      kind: "numberList",
      unit: "%",
    },
    {
      id: "maximumCombinedCreditPercent",
      label: "Maximum combined credit",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "rawCombinedCreditPercent",
      label: "Raw combined credit",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "appliedCreditPercent",
      label: "Applied credit",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "premiumCredit",
      label: "Premium credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "mitigatedPremium",
      label: "Premium after credit",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Wind-Mitigation Credit",
});

export const run = tool.execute;
export default tool;
