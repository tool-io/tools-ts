import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { x: 1 },
  output: { y: 0.7615941559557649 },
} satisfies ToolExample<{ x: number }, { y: number }>;

export const tanhTool = createSimpleTool({
  id: "activation/tanh",
  title: "Hyperbolic Tangent",
  description: "Apply the hyperbolic tangent activation.",
  inputs: [
    { description: "Input value.", id: "x", kind: "number", label: "X" },
  ],
  outputs: [
    {
      description: "tanh(x).",
      id: "y",
      kind: "number",
      label: "Y",
    },
  ],
  calculate: (input) => ({ y: Math.tanh(input.x as number) }),
});

export const runTanh = tanhTool.execute;
export default tanhTool;
