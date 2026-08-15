import { createSimpleTool } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export const example = {
  input: { x: 2 },
  output: { y: 2.1269280110429727 },
} satisfies ToolExample<{ x: number }, { y: number }>;

export const softplusTool = createSimpleTool({
  id: "activation/softplus",
  title: "Softplus",
  description: "Apply the numerically stable softplus activation.",
  inputs: [
    { description: "Input value.", id: "x", kind: "number", label: "X" },
  ],
  outputs: [
    {
      description: "ln(1 + e^x).",
      id: "y",
      kind: "number",
      label: "Y",
    },
  ],
  calculate: (input) => {
    const x = input.x as number;
    return { y: Math.max(0, x) + Math.log1p(Math.exp(-Math.abs(x))) };
  },
});

export const runSoftplus = softplusTool.execute;
export default softplusTool;
