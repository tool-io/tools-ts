import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { x: 5 },
  output: { y: 5 },
} satisfies ToolExample<{ x: number }, { y: number }>;

export const reluTool = createSimpleTool({
  id: "activation/relu",
  title: "ReLU",
  description:
    "Apply the rectified linear activation, flooring negatives at zero.",
  inputs: [
    { description: "Input value.", id: "x", kind: "number", label: "X" },
  ],
  outputs: [{ description: "max(0, x).", id: "y", kind: "number", label: "Y" }],
  calculate: (input) => ({ y: Math.max(0, input.x as number) }),
});

export const runRelu = reluTool.execute;
export default reluTool;
