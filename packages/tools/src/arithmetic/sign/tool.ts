import { createSimpleTool } from "../../core/simple.js";
export const signTool = createSimpleTool({
  id: "arithmetic/sign",
  title: "Sign of Number Calculator",
  description: "Return minus one, zero, or one for a finite number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "sign", label: "Sign", kind: "integer" }],
  calculate: (input) => {
    return { sign: Math.sign(input.value as number) };
  },
});
export const runSign = signTool.execute;
export default signTool;
