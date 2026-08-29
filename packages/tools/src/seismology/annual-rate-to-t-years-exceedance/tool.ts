import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const annualRateToTYearsExceedanceExample = {
  input: { annualRatePerYear: 0.02, windowYears: 100 },
  output: { probabilityOfOccurrence: 0.8646647167633873, expectedCount: 2 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const annualRateToTYearsExceedanceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ annualRatePerYear, windowYears }) => ({
      probabilityOfOccurrence: 1 - Math.exp(-annualRatePerYear * windowYears),
      expectedCount: annualRatePerYear * windowYears,
    }))(input as never) as Record<string, unknown>,
  description:
    "Convert an annual exceedance rate to the probability of exceeding at least once in T years.",
  id: "seismology/annual-rate-to-t-years-exceedance",
  inputs: [
    {
      minimum: 0,
      description: "Annual rate of exceedance.",
      id: "annualRatePerYear",
      kind: "number",
      label: "λ",
      unit: "1/yr",
    },
    {
      minimum: 0,
      description: "Window length.",
      id: "windowYears",
      kind: "number",
      label: "T",
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "At-least-once probability.",
      id: "probabilityOfOccurrence",
      kind: "number",
      label: "P_T",
    },
    {
      description: "Expected number of events.",
      id: "expectedCount",
      kind: "number",
      label: "λT",
      unit: "count",
    },
  ],
  title: "Annual Rate To T Years Exceedance Converter",
});
export const runAnnualRateToTYearsExceedance =
  annualRateToTYearsExceedanceTool.execute;
export { annualRateToTYearsExceedanceExample as example };
export default annualRateToTYearsExceedanceTool;
