import { createSimpleTool } from "../../core/simple.js";
export const digitalRootTool = createSimpleTool({
  id: "number/digital-root",
  title: "Digital Root Calculator",
  description: "Calculate the repeated base-10 digit sum of a safe integer.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "digitalRoot", label: "Digital root", kind: "integer" }],
  calculate: (input) => {
    const value = Math.abs(input.value as number);
    return { digitalRoot: value === 0 ? 0 : 1 + ((value - 1) % 9) };
  },
});
export const runDigitalRoot = digitalRootTool.execute;
export default digitalRootTool;
