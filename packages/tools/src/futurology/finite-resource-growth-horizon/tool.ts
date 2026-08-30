import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly resourceStock: number;
  readonly initialAnnualUse: number;
  readonly annualGrowthRatePercent: number;
}>;
export type Output = Readonly<{
  readonly depletionHorizonYears: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.initialAnnualUse <= 0)
    simpleError(
      "initialAnnualUse",
      "Initial use must be positive.",
      "invalid_use",
    );
  const rate = input.annualGrowthRatePercent / 100;
  const depletionHorizonYears =
    rate === 0
      ? input.resourceStock / input.initialAnnualUse
      : Math.log1p((input.resourceStock * rate) / input.initialAnnualUse) /
        Math.log1p(rate);
  if (!Number.isFinite(depletionHorizonYears))
    simpleError(
      "resourceStock",
      "Result is outside the numeric range.",
      "numeric_overflow",
    );
  return { depletionHorizonYears };
};

export const exampleInput = {
  resourceStock: 1000,
  initialAnnualUse: 50,
  annualGrowthRatePercent: 2,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  resourceStock: 1000,
  initialAnnualUse: 50,
  annualGrowthRatePercent: 0,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      resourceStock: input.resourceStock as number,
      initialAnnualUse: input.initialAnnualUse as number,
      annualGrowthRatePercent: input.annualGrowthRatePercent as number,
    }),
  description:
    "Estimate a finite-stock depletion horizon under constant geometric consumption growth.",
  id: "futurology/finite-resource-growth-horizon",
  inputs: [
    {
      id: "resourceStock",
      label: "Resource stock",
      kind: "number",
      minimum: 0,
    },
    {
      id: "initialAnnualUse",
      label: "Initial annual use",
      kind: "number",
      minimum: 0,
    },
    {
      id: "annualGrowthRatePercent",
      label: "Annual use growth rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "depletionHorizonYears",
      label: "Depletion horizon",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
  ],
  title: "Finite Resource Growth Horizon",
});

export const run = tool.execute;
export default tool;
