import { createSimpleTool, simpleError } from "../../core/simple.js";
export const greatestCommonFactorTool = createSimpleTool({
  id: "number/greatest-common-factor",
  title: "Greatest Common Factor Calculator",
  description:
    "Calculate the greatest common factor, also known as the greatest common divisor, of two safe integers.",
  inputs: [
    { id: "first", label: "First integer", kind: "integer" },
    { id: "second", label: "Second integer", kind: "integer" },
  ],
  outputs: [
    {
      id: "greatestCommonFactor",
      label: "Greatest common factor",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    let a = Math.abs(input.first as number);
    let b = Math.abs(input.second as number);
    if (a === 0 && b === 0)
      simpleError("first", "At least one integer must be nonzero.");
    while (b !== 0) [a, b] = [b, a % b];
    return { greatestCommonFactor: a };
  },
});
export const runGreatestCommonFactor = greatestCommonFactorTool.execute;
export default greatestCommonFactorTool;
