import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nadam } from "../step-core.js";

export const example = {
  input: {
    position: [1, 2],
    gradient: [1, 1],
    firstMoment: [0, 0],
    secondMoment: [0, 0],
    beta1: 0.9,
    beta2: 0.999,
    learningRate: 0.1,
    epsilon: 1e-8,
    iteration: 1,
  },
  output: {
    firstMoment: [0.09999999999999998, 0.09999999999999998],
    secondMoment: [0.0010000000000000009, 0.0010000000000000009],
    nextPosition: [0.8100000019, 1.8100000019],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "optimization/nadam-step",
  title: "Nadam Optimizer Step",
  description:
    "Apply a bias-corrected Nesterov Adam update from caller-supplied first and second moments and the one-based iteration.",
  inputs: [
    { id: "position", kind: "numberList", label: "position" },
    { id: "gradient", kind: "numberList", label: "gradient" },
    { id: "firstMoment", kind: "numberList", label: "first Moment" },
    { id: "secondMoment", kind: "numberList", label: "second Moment" },
    { id: "beta1", kind: "number", label: "beta1", minimum: 0 },
    { id: "beta2", kind: "number", label: "beta2", minimum: 0 },
    { id: "learningRate", kind: "number", label: "learning Rate", minimum: 0 },
    { id: "epsilon", kind: "number", label: "epsilon", minimum: 1e-15 },
    { id: "iteration", kind: "integer", label: "iteration", minimum: 1 },
  ],
  outputs: [
    { id: "nextPosition", kind: "numberList", label: "Next position" },
    { id: "firstMoment", kind: "numberList", label: "First moment" },
    { id: "secondMoment", kind: "numberList", label: "Second moment" },
  ],
  calculate: (input) =>
    nadam(
      input.position as number[],
      input.gradient as number[],
      input.firstMoment as number[],
      input.secondMoment as number[],
      input.beta1 as number,
      input.beta2 as number,
      input.learningRate as number,
      input.epsilon as number,
      input.iteration as number,
    ),
});
export type NadamStepInput = Readonly<typeof example.input>;
export type NadamStepOutput = Readonly<typeof example.output>;
export const nadamStepTool = tool;
export const runNadamStep = tool.execute;
export default tool;
