import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { trustRegion } from "../step-core.js";

export const example = {
  input: {
    position: [1, 2],
    gradient: [1, 1],
    hessianDiagonal: [1, 1],
    radius: 0.1,
  },
  output: {
    step: [-0.07071067811865475, -0.07071067811865475],
    nextPosition: [0.9292893218813453, 1.9292893218813452],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "optimization/trust-region-step",
  title: "Diagonal Trust Region Optimizer Step",
  description:
    "Solve a convex diagonal quadratic trust-region subproblem for a bounded Euclidean step. This is a diagonal model, not a full-Hessian solver.",
  inputs: [
    { id: "position", kind: "numberList", label: "position" },
    { id: "gradient", kind: "numberList", label: "gradient" },
    { id: "hessianDiagonal", kind: "numberList", label: "hessian Diagonal" },
    { id: "radius", kind: "number", label: "radius", minimum: 1e-15 },
  ],
  outputs: [
    { id: "nextPosition", kind: "numberList", label: "Next position" },
    { id: "step", kind: "numberList", label: "Step" },
  ],
  calculate: (input) =>
    trustRegion(
      input.position as number[],
      input.gradient as number[],
      input.hessianDiagonal as number[],
      input.radius as number,
    ),
});
export type TrustRegionStepInput = Readonly<typeof example.input>;
export type TrustRegionStepOutput = Readonly<typeof example.output>;
export const trustRegionStepTool = tool;
export const runTrustRegionStep = tool.execute;
export default tool;
