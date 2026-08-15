import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { x: -3 },
  output: { y: -0.03 },
} satisfies ToolExample<{ alpha?: number; x: number }, { y: number }>;

export const leakyReluTool = createSimpleTool({
  id: "activation/leaky-relu",
  title: "Leaky ReLU",
  description:
    "Apply the leaky ReLU activation, scaling negatives by a small slope.",
  inputs: [
    { description: "Input value.", id: "x", kind: "number", label: "X" },
    {
      default: 0.01,
      description: "Negative-branch slope.",
      id: "alpha",
      kind: "number",
      label: "Alpha",
    },
  ],
  outputs: [
    { description: "Activated value.", id: "y", kind: "number", label: "Y" },
  ],
  calculate: (input) => {
    const x = input.x as number;
    return { y: x >= 0 ? x : x * (input.alpha as number) };
  },
});

export const runLeakyRelu = leakyReluTool.execute;
export default leakyReluTool;
