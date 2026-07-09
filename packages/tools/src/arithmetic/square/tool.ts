import { createSimpleTool, simpleError } from "../../core/simple.js";
export const squareTool = createSimpleTool({
  id: "arithmetic/square",
  title: "Square Calculator",
  description: "Calculate the square of a finite number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "square", label: "Square", kind: "number" }],
  calculate: (input) => {
    const square = (input.value as number) ** 2;
    if (!Number.isFinite(square))
      simpleError("value", "The square exceeds the finite number range.");
    return { square };
  },
});
export const runSquare = squareTool.execute;
export default squareTool;
