import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const populationGrowthExponentialExample = {
  input: { growthRatePerCapita: 0.05, initialPop: 100, timeUnits: 10 },
  output: { projectedPopulation: 164.87212707001282 },
} satisfies ToolExample<
  {
    readonly growthRatePerCapita: number;
    readonly initialPop: number;
    readonly timeUnits: number;
  },
  { readonly projectedPopulation: number }
>;

export const populationGrowthExponentialTool = createSimpleTool({
  id: "biology/population-growth-exponential",
  title: "Exponential Growth",
  description: "Project a population with continuous exponential growth.",
  inputs: [
    {
      id: "initialPop",
      kind: "number",
      label: "Initial population",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "growthRatePerCapita",
      kind: "number",
      label: "Growth rate per capita",
      unit: "1/time",
    },
    {
      id: "timeUnits",
      kind: "number",
      label: "Time elapsed",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "projectedPopulation",
      kind: "number",
      label: "Projected population",
    },
  ],
  calculate: (input) => ({
    projectedPopulation:
      (input.initialPop as number) *
      Math.exp(
        (input.growthRatePerCapita as number) * (input.timeUnits as number),
      ),
  }),
});
export const runPopulationGrowthExponential =
  populationGrowthExponentialTool.execute;
export default populationGrowthExponentialTool;
