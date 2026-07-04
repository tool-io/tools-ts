import { createSimpleTool, simpleError } from "../../core/simple.js";
export const floorToMultipleTool = createSimpleTool({
  id: "arithmetic/floor-to-multiple",
  title: "Floor to Multiple Calculator",
  description: "Round a finite number downward to the nearest multiple.",
  inputs: [
    { id: "value", label: "Value", kind: "number" },
    { id: "multiple", label: "Multiple", kind: "number" },
  ],
  outputs: [{ id: "result", label: "Rounded value", kind: "number" }],
  calculate: (input) => {
    const m = input.multiple as number;
    if (m === 0) simpleError("multiple", "Multiple must not be zero.");
    return {
      result: Math.floor((input.value as number) / Math.abs(m)) * Math.abs(m),
    };
  },
});
export const runFloorToMultiple = floorToMultipleTool.execute;
export default floorToMultipleTool;
