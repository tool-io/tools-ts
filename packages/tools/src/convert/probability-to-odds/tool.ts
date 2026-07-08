import { createSimpleTool, simpleError } from "../../core/simple.js";
export const probabilityToOddsTool = createSimpleTool({
  id: "convert/probability-to-odds",
  title: "Probability to Odds Converter",
  description: "Convert a probability below one into decimal odds.",
  inputs: [
    {
      id: "probability",
      label: "Probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [{ id: "odds", label: "Odds", kind: "number" }],
  calculate: (input) => {
    const probability = input.probability as number;
    if (probability >= 1)
      simpleError("probability", "Probability must be below one.");
    return { odds: probability / (1 - probability) };
  },
});
export const runProbabilityToOdds = probabilityToOddsTool.execute;
export default probabilityToOddsTool;
