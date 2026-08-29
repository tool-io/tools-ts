import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { interiorPoint } from "../step-core.js";

export const example = {
  input: {
    position: [1, 2],
    gradient: [1, 1],
    barrierWeight: 0.1,
    learningRate: 0.1,
  },
  output: { nextPosition: [0.91, 1.905] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "optimization/interior-point-step",
  title: "Log-Barrier Interior Point Step",
  description:
    "Apply one gradient step to f(x) − μ∑log(xᵢ) for strictly positive coordinates. Reject steps that leave the feasible region.",
  inputs: [
    { id: "position", kind: "numberList", label: "position" },
    { id: "gradient", kind: "numberList", label: "gradient" },
    {
      id: "barrierWeight",
      kind: "number",
      label: "barrier Weight",
      minimum: 0,
    },
    { id: "learningRate", kind: "number", label: "learning Rate", minimum: 0 },
  ],
  outputs: [{ id: "nextPosition", kind: "numberList", label: "Next position" }],
  calculate: (input) =>
    interiorPoint(
      input.position as number[],
      input.gradient as number[],
      input.barrierWeight as number,
      input.learningRate as number,
    ),
});
export type InteriorPointStepInput = Readonly<typeof example.input>;
export type InteriorPointStepOutput = Readonly<typeof example.output>;
export const interiorPointStepTool = tool;
export const runInteriorPointStep = tool.execute;
export default tool;
