import { createSimpleTool, simpleError } from "../../core/simple.js";
export const annualizedReturnTool = createSimpleTool({
  id: "finance/annualized-return",
  title: "Annualized Return Calculator",
  description:
    "Calculate the compound annualized return between starting and ending values.",
  inputs: [
    {
      id: "startingValue",
      label: "Starting value",
      kind: "number",
      minimum: 0,
    },
    { id: "endingValue", label: "Ending value", kind: "number", minimum: 0 },
    { id: "years", label: "Years", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "annualizedReturn",
      label: "Annualized return",
      kind: "number",
      format: "rate",
    },
    {
      id: "annualizedReturnPercent",
      label: "Annualized return",
      kind: "number",
      format: "percentage",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const start = input.startingValue as number,
      years = input.years as number;
    if (start <= 0)
      simpleError("startingValue", "Starting value must be positive.");
    if (years <= 0) simpleError("years", "Years must be positive.");
    const annualizedReturn =
      ((input.endingValue as number) / start) ** (1 / years) - 1;
    return {
      annualizedReturn,
      annualizedReturnPercent: annualizedReturn * 100,
    };
  },
});
export const runAnnualizedReturn = annualizedReturnTool.execute;
export default annualizedReturnTool;
