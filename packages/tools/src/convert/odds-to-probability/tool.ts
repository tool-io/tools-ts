import { createSimpleTool } from "../../core/simple.js";
export const oddsToProbabilityTool = createSimpleTool({
  id: "convert/odds-to-probability",
  title: "Odds to Probability Converter",
  description: "Convert decimal odds against one into probability.",
  inputs: [{ id: "odds", label: "Odds", kind: "number", minimum: 0 }],
  outputs: [
    {
      id: "probability",
      label: "Probability",
      kind: "number",
      format: "probability",
    },
    { id: "percent", label: "Probability", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const odds = input.odds as number;
    const probability = odds / (1 + odds);
    return { probability, percent: probability * 100 };
  },
});
export const runOddsToProbability = oddsToProbabilityTool.execute;
export default oddsToProbabilityTool;
