import { createSimpleTool, simpleError } from "../../core/simple.js";
export const loanToValueRatioTool = createSimpleTool({
  id: "finance/loan-to-value-ratio",
  title: "Loan-to-Value Ratio Calculator",
  description: "Calculate a loan balance as a percentage of property value.",
  inputs: [
    { id: "loanAmount", label: "Loan amount", kind: "number", minimum: 0 },
    {
      id: "propertyValue",
      label: "Property value",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "ratio",
      label: "Loan-to-value ratio",
      kind: "number",
      format: "ratio",
    },
    { id: "percent", label: "Loan-to-value ratio", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const value = input.propertyValue as number;
    if (value <= 0)
      simpleError("propertyValue", "Property value must be positive.");
    const ratio = (input.loanAmount as number) / value;
    return { ratio, percent: ratio * 100 };
  },
});
export const runLoanToValueRatio = loanToValueRatioTool.execute;
export default loanToValueRatioTool;
