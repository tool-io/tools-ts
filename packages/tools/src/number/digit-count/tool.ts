import { createSimpleTool } from "../../core/simple.js";
export const digitCountTool = createSimpleTool({
  id: "number/digit-count",
  title: "Digit Count Calculator",
  description:
    "Count the base-10 digits in a safe integer without counting its sign.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "digits", label: "Digit count", kind: "integer" }],
  calculate: (input) => {
    return { digits: Math.abs(input.value as number).toString().length };
  },
});
export const runDigitCount = digitCountTool.execute;
export default digitCountTool;
