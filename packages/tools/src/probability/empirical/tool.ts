import { createSimpleTool, simpleError } from "../../core/simple.js";
export const empiricalTool = createSimpleTool({
  id: "probability/empirical",
  title: "Empirical Probability Calculator",
  description:
    "Calculate empirical probability from observed successes and trials.",
  inputs: [
    { id: "successes", label: "Successes", kind: "integer", minimum: 0 },
    { id: "trials", label: "Trials", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "probability",
      label: "Probability",
      kind: "number",
      format: "probability",
    },
    { id: "percent", label: "Percentage", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    if ((input.successes as number) > (input.trials as number))
      simpleError("successes", "Successes must not exceed trials.");
    const probability = (input.successes as number) / (input.trials as number);
    return { probability, percent: probability * 100 };
  },
});
export const runEmpirical = empiricalTool.execute;
export default empiricalTool;
