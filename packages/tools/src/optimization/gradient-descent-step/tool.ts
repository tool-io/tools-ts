import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { gradientDescent } from "../step-core.js";

export const example = {
  input: { position: [1, 2], gradient: [1, 1], learningRate: 0.1 },
  output: { nextPosition: [0.9, 1.9] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "optimization/gradient-descent-step",
  title: "Gradient Descent Optimizer Step",
  description:
    "Apply one gradient-descent update x − η∇f; the caller supplies the gradient and learning rate.",
  inputs: [
    { id: "position", kind: "numberList", label: "position" },
    { id: "gradient", kind: "numberList", label: "gradient" },
    { id: "learningRate", kind: "number", label: "learning Rate", minimum: 0 },
  ],
  outputs: [{ id: "nextPosition", kind: "numberList", label: "Next position" }],
  calculate: (input) =>
    gradientDescent(
      input.position as number[],
      input.gradient as number[],
      input.learningRate as number,
    ),
});
export type GradientDescentStepInput = Readonly<typeof example.input>;
export type GradientDescentStepOutput = Readonly<typeof example.output>;
export const gradientDescentStepTool = tool;
export const runGradientDescentStep = tool.execute;
export default tool;
