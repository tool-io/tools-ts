import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const populationDoublingTimeEcologyExample = {
  input: { growthRatePerCapita: 0.05 },
  output: { doublingTime: 13.862943611198904 },
} satisfies ToolExample<
  { readonly growthRatePerCapita: number },
  { readonly doublingTime: number }
>;

export const populationDoublingTimeEcologyTool = createSimpleTool({
  id: "biology/population-doubling-time-ecology",
  title: "Ecological Doubling Time",
  description:
    "Compute the doubling time of a population growing exponentially.",
  inputs: [
    {
      id: "growthRatePerCapita",
      kind: "number",
      label: "Growth rate per capita",
      minimum: Number.MIN_VALUE,
      unit: "1/time",
    },
  ],
  outputs: [
    {
      id: "doublingTime",
      kind: "number",
      label: "Doubling time",
    },
  ],
  calculate: (input) => ({
    doublingTime: Math.LN2 / (input.growthRatePerCapita as number),
  }),
});
export const runPopulationDoublingTimeEcology =
  populationDoublingTimeEcologyTool.execute;
export default populationDoublingTimeEcologyTool;
