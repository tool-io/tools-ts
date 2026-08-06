import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RmspropStep = {
  readonly averageSquaredGradient: number;
  readonly parameter: number;
  readonly update: number;
};
const round = (value: number): number => Number(value.toPrecision(12));
export const calculateRmspropStep = (
  parameter: number,
  gradient: number,
  average: number,
  learningRate: number,
  decay: number,
  epsilon: number,
): RmspropStep => {
  const nextAverage = decay * average + (1 - decay) * gradient ** 2;
  const update = (learningRate * gradient) / (Math.sqrt(nextAverage) + epsilon);
  return {
    averageSquaredGradient: round(nextAverage),
    parameter: round(parameter - update),
    update: round(update),
  };
};

export const rmspropStepExample = {
  input: {
    average: 0,
    decay: 0.9,
    epsilon: 1e-8,
    gradient: 0.1,
    learningRate: 0.001,
    parameter: 1,
  },
  output: {
    result: {
      averageSquaredGradient: 0.001,
      parameter: 0.99683772334,
      update: 0.00316227666017,
    },
  },
} satisfies ToolExample<
  {
    readonly average: number;
    readonly decay: number;
    readonly epsilon: number;
    readonly gradient: number;
    readonly learningRate: number;
    readonly parameter: number;
  },
  { readonly result: RmspropStep }
>;

export const rmspropStepTool = createSimpleTool({
  id: "optimization/rmsprop-step",
  title: "RMSProp Optimizer Step Calculator",
  description:
    "Calculate one scalar RMSProp parameter update and its moving squared-gradient state.",
  inputs: [
    { id: "parameter", kind: "number", label: "Parameter" },
    { id: "gradient", kind: "number", label: "Gradient" },
    {
      id: "average",
      kind: "number",
      label: "Squared-gradient average",
      minimum: 0,
    },
    {
      id: "learningRate",
      kind: "number",
      label: "Learning rate",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "decay",
      kind: "number",
      label: "Decay",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
    {
      id: "epsilon",
      kind: "number",
      label: "Epsilon",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "optimizer/rmsprop-step",
      id: "result",
      kind: "object",
      label: "RMSProp step",
    },
  ],
  calculate: (input) => ({
    result: calculateRmspropStep(
      input.parameter as number,
      input.gradient as number,
      input.average as number,
      input.learningRate as number,
      input.decay as number,
      input.epsilon as number,
    ),
  }),
});

export const runRmspropStep = rmspropStepTool.execute;
export default rmspropStepTool;
