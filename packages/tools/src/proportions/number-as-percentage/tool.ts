import { createSimpleTool, simpleError } from "../../core/simple.js";
export const numberAsPercentageTool = createSimpleTool({
  id: "proportions/number-as-percentage",
  title: "Number as Percentage Calculator",
  description: "Calculate what percentage one number is of another.",
  inputs: [
    { id: "part", label: "Part", kind: "number" },
    { id: "whole", label: "Whole", kind: "number" },
  ],
  outputs: [{ id: "percent", label: "Percentage", kind: "number", unit: "%" }],
  calculate: (input) => {
    const whole = input.whole as number;
    if (whole === 0) simpleError("whole", "Whole must not be zero.");
    return { percent: ((input.part as number) / whole) * 100 };
  },
});
export const runNumberAsPercentage = numberAsPercentageTool.execute;
export default numberAsPercentageTool;
