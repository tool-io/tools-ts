import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ruleOf72Tool = createSimpleTool({
  id: "finance/rule-of-72",
  title: "Doubling Time Rule of 72 Calculator",
  description:
    "Estimate doubling time from an annual percentage return using the Rule of 72.",
  inputs: [
    {
      id: "annualRatePercent",
      label: "Annual rate",
      kind: "number",
      unit: "%",
    },
  ],
  outputs: [{ id: "years", label: "Estimated years", kind: "number" }],
  calculate: (input) => {
    const rate = input.annualRatePercent as number;
    if (rate <= 0)
      simpleError("annualRatePercent", "Annual rate must be positive.");
    return { years: 72 / rate };
  },
});
export const runRuleOf72 = ruleOf72Tool.execute;
export default ruleOf72Tool;
