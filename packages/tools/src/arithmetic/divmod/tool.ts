import { createSimpleTool, simpleError } from "../../core/simple.js";
export const divmodTool = createSimpleTool({
  id: "arithmetic/divmod",
  title: "Division with Remainder Calculator",
  description:
    "Calculate an integer quotient and remainder using truncating division.",
  inputs: [
    { id: "dividend", label: "Dividend", kind: "integer" },
    { id: "divisor", label: "Divisor", kind: "integer" },
  ],
  outputs: [
    { id: "quotient", label: "Quotient", kind: "integer" },
    { id: "remainder", label: "Remainder", kind: "integer" },
  ],
  calculate: (input) => {
    const divisor = input.divisor as number;
    if (divisor === 0) simpleError("divisor", "Divisor must not be zero.");
    const dividend = input.dividend as number;
    const quotient = Math.trunc(dividend / divisor);
    return { quotient, remainder: dividend - quotient * divisor };
  },
});
export const runDivmod = divmodTool.execute;
export default divmodTool;
