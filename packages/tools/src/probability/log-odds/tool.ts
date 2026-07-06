import { createSimpleTool, simpleError } from "../../core/simple.js";
export const logOddsTool = createSimpleTool({
  id: "probability/log-odds",
  title: "Log-Odds Calculator",
  description:
    "Calculate natural log-odds from a probability strictly between zero and one.",
  inputs: [
    {
      id: "probability",
      label: "Probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [{ id: "logOdds", label: "Log-odds", kind: "number" }],
  calculate: (input) => {
    const probability = input.probability as number;
    if (probability <= 0 || probability >= 1)
      simpleError(
        "probability",
        "Probability must be strictly between zero and one.",
      );
    return { logOdds: Math.log(probability / (1 - probability)) };
  },
});
export const runLogOdds = logOddsTool.execute;
export default logOddsTool;
