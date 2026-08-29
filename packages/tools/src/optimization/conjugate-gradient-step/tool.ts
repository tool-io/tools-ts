import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { conjugateGradient } from "../step-core.js";

export const example = {
  input: {
    position: [1, 2],
    gradient: [1, 1],
    previousGradient: [1, 0],
    previousDirection: [-1, 0],
    learningRate: 0.1,
  },
  output: { beta: 2, direction: [-3, -1], nextPosition: [0.7, 1.9] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "optimization/conjugate-gradient-step",
  title: "Conjugate Gradient Optimizer Step",
  description:
    "Compute a Fletcher–Reeves conjugate-gradient direction and one caller-sized step from current and previous gradients.",
  inputs: [
    { id: "position", kind: "numberList", label: "position" },
    { id: "gradient", kind: "numberList", label: "gradient" },
    { id: "previousGradient", kind: "numberList", label: "previous Gradient" },
    {
      id: "previousDirection",
      kind: "numberList",
      label: "previous Direction",
    },
    { id: "learningRate", kind: "number", label: "learning Rate", minimum: 0 },
  ],
  outputs: [
    { id: "nextPosition", kind: "numberList", label: "Next position" },
    { id: "direction", kind: "numberList", label: "Direction" },
    { id: "beta", kind: "number", label: "Fletcher–Reeves beta" },
  ],
  calculate: (input) =>
    conjugateGradient(
      input.position as number[],
      input.gradient as number[],
      input.previousGradient as number[],
      input.previousDirection as number[],
      input.learningRate as number,
    ),
});
export type ConjugateGradientStepInput = Readonly<typeof example.input>;
export type ConjugateGradientStepOutput = Readonly<typeof example.output>;
export const conjugateGradientStepTool = tool;
export const runConjugateGradientStep = tool.execute;
export default tool;
