import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { x: 2 },
  output: { y: 0.8807970779778823 },
} satisfies ToolExample<{ x: number }, { y: number }>;

export const sigmoidTool = createSimpleTool({
  id: "activation/sigmoid",
  title: "Sigmoid",
  description: "Apply the logistic sigmoid activation.",
  inputs: [
    { description: "Input value.", id: "x", kind: "number", label: "X" },
  ],
  outputs: [
    {
      description: "1 / (1 + e^-x).",
      id: "y",
      kind: "number",
      label: "Y",
    },
  ],
  calculate: (input) => {
    const x = input.x as number;
    const exponential = Math.exp(-Math.abs(x));
    return {
      y: x >= 0 ? 1 / (1 + exponential) : exponential / (1 + exponential),
    };
  },
});

export const runSigmoid = sigmoidTool.execute;
export default sigmoidTool;
