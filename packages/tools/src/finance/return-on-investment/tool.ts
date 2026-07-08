import { createSimpleTool, simpleError } from "../../core/simple.js";
export const returnOnInvestmentTool = createSimpleTool({
  id: "finance/return-on-investment",
  title: "Return on Investment Calculator",
  description: "Calculate net return and return on investment percentage.",
  inputs: [
    { id: "gain", label: "Gain", kind: "number" },
    { id: "cost", label: "Investment cost", kind: "number" },
  ],
  outputs: [
    { id: "netReturn", label: "Net return", kind: "number" },
    {
      id: "returnPercent",
      label: "Return on investment",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const cost = input.cost as number;
    if (cost === 0) simpleError("cost", "Investment cost must not be zero.");
    const netReturn = (input.gain as number) - cost;
    return { netReturn, returnPercent: (netReturn / cost) * 100 };
  },
});
export const runReturnOnInvestment = returnOnInvestmentTool.execute;
export default returnOnInvestmentTool;
