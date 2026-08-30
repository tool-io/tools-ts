import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly activeEmployeePremium: number;
  readonly employerSubsidy: number;
  readonly administrativePercent: number;
  readonly continuationMonths: number;
}>;
export type Output = Readonly<{
  readonly baseContinuationPremium: number;
  readonly monthlyPremiumWithAdmin: number;
  readonly totalContinuationPremium: number;
}>;

export const calculate = (input: Input): Output => {
  const baseContinuationPremium =
      input.activeEmployeePremium + input.employerSubsidy,
    monthlyPremiumWithAdmin =
      baseContinuationPremium * (1 + input.administrativePercent / 100);
  return {
    baseContinuationPremium,
    monthlyPremiumWithAdmin,
    totalContinuationPremium:
      monthlyPremiumWithAdmin * input.continuationMonths,
  };
};

export const exampleInput = {
  activeEmployeePremium: 200,
  employerSubsidy: 800,
  administrativePercent: 2,
  continuationMonths: 18,
} satisfies Input;
export const exampleOutput = {
  baseContinuationPremium: 1000,
  monthlyPremiumWithAdmin: 1020,
  totalContinuationPremium: 18360,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      activeEmployeePremium: input.activeEmployeePremium as number,
      employerSubsidy: input.employerSubsidy as number,
      administrativePercent: input.administrativePercent as number,
      continuationMonths: input.continuationMonths as number,
    }),
  description:
    "Calculate continuation premium from full plan cost and administrative load.",
  id: "insurance/cobra-premium",
  inputs: [
    {
      id: "activeEmployeePremium",
      label: "Active employee premium",
      kind: "number",
      minimum: 0,
    },
    {
      id: "employerSubsidy",
      label: "Employer subsidy",
      kind: "number",
      minimum: 0,
    },
    {
      id: "administrativePercent",
      label: "Administrative load",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "continuationMonths",
      label: "Continuation months",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "baseContinuationPremium",
      label: "Monthly continuation premium",
      kind: "number",
      minimum: 0,
    },
    {
      id: "monthlyPremiumWithAdmin",
      label: "Monthly premium with administration",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalContinuationPremium",
      label: "Total continuation premium",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "COBRA Premium",
});

export const run = tool.execute;
export default tool;
