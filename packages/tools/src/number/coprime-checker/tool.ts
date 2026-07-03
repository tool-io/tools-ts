import { createSimpleTool, simpleError } from "../../core/simple.js";
export const coprimeCheckerTool = createSimpleTool({
  id: "number/coprime-checker",
  title: "Coprime Number Checker",
  description:
    "Check whether two nonzero safe integers share no factor greater than one.",
  inputs: [
    { id: "first", label: "First integer", kind: "integer" },
    { id: "second", label: "Second integer", kind: "integer" },
  ],
  outputs: [
    { id: "coprime", label: "Coprime", kind: "boolean" },
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
    return { coprime: a === 1, greatestCommonFactor: a };
  },
});
export const runCoprimeChecker = coprimeCheckerTool.execute;
export default coprimeCheckerTool;
