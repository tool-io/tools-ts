import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const mastitisRiskScoreExample = {
  input: { sccCellsMl: 250000 },
} satisfies ToolExample<{
  readonly sccCellsMl: number;
}>;

export const mastitisRiskScoreTool = createSimpleTool({
  id: "biology/mastitis-risk-score",
  title: "Mastitis Risk Category",
  description:
    "Classify mastitis risk from the somatic cell count in cells per millilitre.",
  inputs: [
    {
      id: "sccCellsMl",
      label: "Somatic cell count cells/mL",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "riskCategory", label: "Risk category", kind: "string" }],
  calculate: (input) => {
    const sccCellsMl = input.sccCellsMl as number;
    return {
      riskCategory:
        sccCellsMl < 200000 ? "low" : sccCellsMl < 400000 ? "moderate" : "high",
    };
  },
});
export const runMastitisRiskScore = mastitisRiskScoreTool.execute;
export default mastitisRiskScoreTool;
