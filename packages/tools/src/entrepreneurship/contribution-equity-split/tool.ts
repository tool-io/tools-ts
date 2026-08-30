import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly contributors: readonly string[];
  readonly cashContributions: readonly number[];
  readonly laborHours: readonly number[];
  readonly hourlyValues: readonly number[];
  readonly cashRiskMultiplier: number;
  readonly laborRiskMultiplier: number;
}>;
export type Output = Readonly<{
  readonly contributionUnits: readonly number[];
  readonly equityPercent: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.contributors, input.cashContributions, "contributors");
  if (
    input.laborHours.length !== input.contributors.length ||
    input.hourlyValues.length !== input.contributors.length
  )
    simpleError(
      "laborHours",
      "Aligned labor hours and hourly values required.",
    );
  input.laborHours.forEach((v) => nonnegative(v, "laborHours"));
  input.hourlyValues.forEach((v) => nonnegative(v, "hourlyValues"));
  positive(input.cashRiskMultiplier, "cashRiskMultiplier");
  positive(input.laborRiskMultiplier, "laborRiskMultiplier");
  const contributionUnits = input.cashContributions.map(
      (v, i) =>
        v * input.cashRiskMultiplier +
        input.laborHours[i] * input.hourlyValues[i] * input.laborRiskMultiplier,
    ),
    total = contributionUnits.reduce((a, b) => a + b, 0);
  positive(total, "cashContributions");
  return {
    contributionUnits,
    equityPercent: contributionUnits.map((v) => (100 * v) / total),
  };
};
export const exampleInput = {
  contributors: ["A", "B"],
  cashContributions: [100, 0],
  laborHours: [0, 10],
  hourlyValues: [20, 20],
  cashRiskMultiplier: 2,
  laborRiskMultiplier: 1,
} satisfies Input;
export const exampleOutput = {
  contributionUnits: [200, 200],
  equityPercent: [50, 50],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/contribution-equity-split",
  title: "Contribution Equity Split",
  description:
    "Allocate equity by explicitly weighted cash and valued labor contributions.",
  inputs: [
    { id: "contributors", label: "Contributors", kind: "stringList" },
    {
      id: "cashContributions",
      label: "Cash contributions",
      kind: "numberList",
    },
    { id: "laborHours", label: "Labor hours", kind: "numberList" },
    { id: "hourlyValues", label: "Hourly values", kind: "numberList" },
    { id: "cashRiskMultiplier", label: "Cash risk multiplier", kind: "number" },
    {
      id: "laborRiskMultiplier",
      label: "Labor risk multiplier",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "contributionUnits",
      label: "Contribution units",
      kind: "numberList",
    },
    { id: "equityPercent", label: "Equity percent", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      contributors: value.contributors as readonly string[],
      cashContributions: value.cashContributions as readonly number[],
      laborHours: value.laborHours as readonly number[],
      hourlyValues: value.hourlyValues as readonly number[],
      cashRiskMultiplier: value.cashRiskMultiplier as number,
      laborRiskMultiplier: value.laborRiskMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;
