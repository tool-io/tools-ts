import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { steepestDescent } from "../step-core.js";

export const example = {
  input: { position: [1, 2], gradient: [1, 1], stepLength: 0.1 },
  output: { nextPosition: [0.9292893218813453, 1.9292893218813452] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "optimization/steepest-descent-step",
  title: "Steepest Descent Optimizer Step",
  description:
    "Move a specified Euclidean distance along the negative normalized gradient; this differs from learning-rate gradient descent.",
  inputs: [
    { id: "position", kind: "numberList", label: "position" },
    { id: "gradient", kind: "numberList", label: "gradient" },
    { id: "stepLength", kind: "number", label: "step Length", minimum: 0 },
  ],
  outputs: [{ id: "nextPosition", kind: "numberList", label: "Next position" }],
  calculate: (input) =>
    steepestDescent(
      input.position as number[],
      input.gradient as number[],
      input.stepLength as number,
    ),
});
export type SteepestDescentStepInput = Readonly<typeof example.input>;
export type SteepestDescentStepOutput = Readonly<typeof example.output>;
export const steepestDescentStepTool = tool;
export const runSteepestDescentStep = tool.execute;
export default tool;
