import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coverageAmount: number;
  readonly excludedCoverageAmount: number;
  readonly monthlyRatePerThousand: number;
  readonly coveredMonths: number;
}>;
export type Output = Readonly<{
  readonly excessCoverage: number;
  readonly imputedIncome: number;
}>;

export const calculate = (input: Input): Output => {
  const excessCoverage = Math.max(
    0,
    input.coverageAmount - input.excludedCoverageAmount,
  );
  return {
    excessCoverage,
    imputedIncome:
      (excessCoverage / 1000) *
      input.monthlyRatePerThousand *
      input.coveredMonths,
  };
};

export const exampleInput = {
  coverageAmount: 100000,
  excludedCoverageAmount: 50000,
  monthlyRatePerThousand: 0.23,
  coveredMonths: 12,
} satisfies Input;
export const exampleOutput = {
  excessCoverage: 50000,
  imputedIncome: 138,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      coverageAmount: input.coverageAmount as number,
      excludedCoverageAmount: input.excludedCoverageAmount as number,
      monthlyRatePerThousand: input.monthlyRatePerThousand as number,
      coveredMonths: input.coveredMonths as number,
    }),
  description:
    "Calculate group-term life imputed income from caller-supplied exclusion and table rate.",
  id: "taxation/group-term-life-imputed-income",
  inputs: [
    {
      id: "coverageAmount",
      label: "Group-term coverage amount",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "excludedCoverageAmount",
      label: "Excluded coverage amount",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "monthlyRatePerThousand",
      label: "Monthly table rate per thousand",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "coveredMonths",
      label: "Covered months",
      kind: "integer",
      minimum: 0,
      maximum: 12,
    },
  ],
  outputs: [
    {
      id: "excessCoverage",
      label: "Excess coverage",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "imputedIncome",
      label: "Imputed income",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Group-Term Life Imputed Income",
});

export const run = tool.execute;
export default tool;
