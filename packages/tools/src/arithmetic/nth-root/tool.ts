import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nthRootTool = createSimpleTool({
  id: "arithmetic/nth-root",
  title: "Nth Root Calculator",
  description: "Calculate a real nth root using a nonzero integer degree.",
  inputs: [
    { id: "value", label: "Value", kind: "number" },
    { id: "degree", label: "Root degree", kind: "integer" },
  ],
  outputs: [{ id: "root", label: "Root", kind: "number" }],
  calculate: (input) => {
    const value = input.value as number;
    const degree = input.degree as number;
    if (degree === 0)
      simpleError("degree", "The root degree must not be zero.");
    if (value < 0 && Math.abs(degree) % 2 === 0)
      simpleError(
        "value",
        "A negative value has no real root for an even degree.",
      );

    const magnitude = Math.abs(value) ** (1 / degree);
    const root = value < 0 ? -magnitude : magnitude;
    if (!Number.isFinite(root))
      simpleError("value", "The inputs do not produce a finite real root.");
    return { root };
  },
});

export const runNthRoot = nthRootTool.execute;
export default nthRootTool;
