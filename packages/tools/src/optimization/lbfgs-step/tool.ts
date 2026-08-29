import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { lbfgs } from "../step-core.js";

export const example = {
  input: {
    position: [1, 2],
    gradient: [1, 1],
    displacements: [],
    gradientChanges: [],
    learningRate: 0.1,
  },
  output: { nextPosition: [0.9, 1.9] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "optimization/lbfgs-step",
  title: "L-BFGS Optimizer Step",
  description:
    "Compute one limited-memory BFGS two-loop direction from valid curvature-pair histories and apply a caller-supplied step size.",
  inputs: [
    { id: "position", kind: "numberList", label: "position" },
    { id: "gradient", kind: "numberList", label: "gradient" },
    { id: "displacements", kind: "matrix", label: "displacements" },
    { id: "gradientChanges", kind: "matrix", label: "gradient Changes" },
    { id: "learningRate", kind: "number", label: "learning Rate", minimum: 0 },
  ],
  outputs: [{ id: "nextPosition", kind: "numberList", label: "Next position" }],
  calculate: (input) =>
    lbfgs(
      input.position as number[],
      input.gradient as number[],
      input.displacements as number[][],
      input.gradientChanges as number[][],
      input.learningRate as number,
    ),
});
export type LbfgsStepInput = Readonly<typeof example.input>;
export type LbfgsStepOutput = Readonly<typeof example.output>;
export const lbfgsStepTool = tool;
export const runLbfgsStep = tool.execute;
export default tool;
