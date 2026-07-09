import { createSimpleTool } from "../../core/simple.js";
export const simpleInterestTool = createSimpleTool({
  id: "finance/simple-interest",
  title: "Simple Interest Calculator",
  description:
    "Calculate simple interest and final balance without compounding.",
  inputs: [
    { id: "principal", label: "Principal", kind: "number" },
    {
      id: "annualRatePercent",
      label: "Annual rate",
      kind: "number",
      unit: "%",
    },
    { id: "years", label: "Years", kind: "number" },
  ],
  outputs: [
    { id: "interest", label: "Interest", kind: "number" },
    { id: "balance", label: "Balance", kind: "number" },
  ],
  calculate: (input) => {
    const interest =
      (((input.principal as number) * (input.annualRatePercent as number)) /
        100) *
      (input.years as number);
    return { interest, balance: (input.principal as number) + interest };
  },
});
export const runSimpleInterest = simpleInterestTool.execute;
export default simpleInterestTool;
