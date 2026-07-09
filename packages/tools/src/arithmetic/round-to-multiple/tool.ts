import { createSimpleTool, simpleError } from "../../core/simple.js";
export const roundToMultipleTool = createSimpleTool({
  id: "arithmetic/round-to-multiple",
  title: "Round to Multiple Calculator",
  description: "Round a finite number to the nearest multiple.",
  inputs: [
    { id: "value", label: "Value", kind: "number" },
    { id: "multiple", label: "Multiple", kind: "number" },
  ],
  outputs: [{ id: "result", label: "Rounded value", kind: "number" }],
  calculate: (input) => {
    const m = input.multiple as number;
    if (m === 0) simpleError("multiple", "Multiple must not be zero.");
    return {
      result: Math.round((input.value as number) / Math.abs(m)) * Math.abs(m),
    };
  },
});
export const runRoundToMultiple = roundToMultipleTool.execute;
export default roundToMultipleTool;
