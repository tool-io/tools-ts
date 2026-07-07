import { createSimpleTool } from "../../core/simple.js";
export const percentageOfNumberTool = createSimpleTool({
  id: "proportions/percentage-of-number",
  title: "Percentage of Number Calculator",
  description: "Calculate a percentage of a finite number.",
  inputs: [
    { id: "percent", label: "Percentage", kind: "number", unit: "%" },
    { id: "value", label: "Value", kind: "number" },
  ],
  outputs: [{ id: "result", label: "Result", kind: "number" }],
  calculate: (input) => {
    return {
      result: ((input.percent as number) / 100) * (input.value as number),
    };
  },
});
export const runPercentageOfNumber = percentageOfNumberTool.execute;
export default percentageOfNumberTool;
