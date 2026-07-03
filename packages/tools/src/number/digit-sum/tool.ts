import { createSimpleTool } from "../../core/simple.js";
export const digitSumTool = createSimpleTool({
  id: "number/digit-sum",
  title: "Digit Sum Calculator",
  description: "Sum the base-10 digits of a safe integer.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "sum", label: "Digit sum", kind: "integer" }],
  calculate: (input) => {
    return {
      sum: [...Math.abs(input.value as number).toString()].reduce(
        (total, digit) => total + Number(digit),
        0,
      ),
    };
  },
});
export const runDigitSum = digitSumTool.execute;
export default digitSumTool;
