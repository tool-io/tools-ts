import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AdagradStep = {
  readonly accumulatedSquaredGradient: number;
  readonly parameter: number;
  readonly update: number;
};
const round = (value: number): number => Number(value.toPrecision(12));
export const calculateAdagradStep = (
  parameter: number,
  gradient: number,
  accumulatedSquaredGradient: number,
  learningRate: number,
  epsilon: number,
): AdagradStep => {
  const nextAccumulatedSquaredGradient =
    accumulatedSquaredGradient + gradient ** 2;
  const update =
    (learningRate * gradient) /
    (Math.sqrt(nextAccumulatedSquaredGradient) + epsilon);
  return {
    accumulatedSquaredGradient: round(nextAccumulatedSquaredGradient),
    parameter: round(parameter - update),
    update: round(update),
  };
};

export const adagradStepExample = {
  input: {
    accumulatedSquaredGradient: 0,
    epsilon: 1e-8,
    gradient: 0.1,
    learningRate: 0.01,
    parameter: 1,
  },
  output: {
    result: {
      accumulatedSquaredGradient: 0.01,
      parameter: 0.990000001,
      update: 0.009999999,
    },
  },
} satisfies ToolExample<
  {
    readonly accumulatedSquaredGradient: number;
    readonly epsilon: number;
    readonly gradient: number;
    readonly learningRate: number;
    readonly parameter: number;
  },
  { readonly result: AdagradStep }
>;

export const adagradStepTool = createSimpleTool({
  id: "optimization/adagrad-step",
  title: "Adagrad Optimizer Step Calculator",
  description:
    "Calculate one scalar Adagrad parameter update and its accumulated gradient state.",
  inputs: [
    { id: "parameter", kind: "number", label: "Parameter" },
    { id: "gradient", kind: "number", label: "Gradient" },
    {
      id: "accumulatedSquaredGradient",
      kind: "number",
      label: "Accumulated squared gradient",
      minimum: 0,
    },
    {
      id: "learningRate",
      kind: "number",
      label: "Learning rate",
      minimum: Number.MIN_VALUE,
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
      format: "optimizer/adagrad-step",
      id: "result",
      kind: "object",
      label: "Adagrad step",
    },
  ],
  calculate: (input) => ({
    result: calculateAdagradStep(
      input.parameter as number,
      input.gradient as number,
      input.accumulatedSquaredGradient as number,
      input.learningRate as number,
      input.epsilon as number,
    ),
  }),
});

export const runAdagradStep = adagradStepTool.execute;
export default adagradStepTool;
