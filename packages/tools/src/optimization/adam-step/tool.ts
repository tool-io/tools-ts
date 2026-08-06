import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AdamStep = {
  readonly correctedFirstMoment: number;
  readonly correctedSecondMoment: number;
  readonly firstMoment: number;
  readonly parameter: number;
  readonly secondMoment: number;
  readonly step: number;
  readonly update: number;
};
const round = (value: number): number => Number(value.toPrecision(12));
export const calculateAdamStep = (
  parameter: number,
  gradient: number,
  firstMoment: number,
  secondMoment: number,
  step: number,
  learningRate: number,
  betaOne: number,
  betaTwo: number,
  epsilon: number,
): AdamStep => {
  const nextFirstMoment = betaOne * firstMoment + (1 - betaOne) * gradient;
  const nextSecondMoment =
    betaTwo * secondMoment + (1 - betaTwo) * gradient ** 2;
  const correctedFirstMoment = nextFirstMoment / (1 - betaOne ** step);
  const correctedSecondMoment = nextSecondMoment / (1 - betaTwo ** step);
  const update =
    (learningRate * correctedFirstMoment) /
    (Math.sqrt(correctedSecondMoment) + epsilon);
  return {
    correctedFirstMoment: round(correctedFirstMoment),
    correctedSecondMoment: round(correctedSecondMoment),
    firstMoment: round(nextFirstMoment),
    parameter: round(parameter - update),
    secondMoment: round(nextSecondMoment),
    step,
    update: round(update),
  };
};

export const adamStepExample = {
  input: {
    betaOne: 0.9,
    betaTwo: 0.999,
    epsilon: 1e-8,
    firstMoment: 0,
    gradient: 0.1,
    learningRate: 0.001,
    parameter: 1,
    secondMoment: 0,
    step: 1,
  },
  output: {
    result: {
      correctedFirstMoment: 0.1,
      correctedSecondMoment: 0.01,
      firstMoment: 0.01,
      parameter: 0.9990000001,
      secondMoment: 0.00001,
      step: 1,
      update: 0.0009999999,
    },
  },
} satisfies ToolExample<
  {
    readonly betaOne: number;
    readonly betaTwo: number;
    readonly epsilon: number;
    readonly firstMoment: number;
    readonly gradient: number;
    readonly learningRate: number;
    readonly parameter: number;
    readonly secondMoment: number;
    readonly step: number;
  },
  { readonly result: AdamStep }
>;

export const adamStepTool = createSimpleTool({
  id: "optimization/adam-step",
  title: "Adam Optimizer Step Calculator",
  description:
    "Calculate one scalar Adam parameter update with bias-corrected moments.",
  inputs: [
    { id: "parameter", kind: "number", label: "Parameter" },
    { id: "gradient", kind: "number", label: "Gradient" },
    { id: "firstMoment", kind: "number", label: "First moment" },
    { id: "secondMoment", kind: "number", label: "Second moment", minimum: 0 },
    { id: "step", kind: "integer", label: "Step", minimum: 1 },
    {
      id: "learningRate",
      kind: "number",
      label: "Learning rate",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "betaOne",
      kind: "number",
      label: "Beta 1",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
    {
      id: "betaTwo",
      kind: "number",
      label: "Beta 2",
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
      format: "optimizer/adam-step",
      id: "result",
      kind: "object",
      label: "Adam step",
    },
  ],
  calculate: (input) => ({
    result: calculateAdamStep(
      input.parameter as number,
      input.gradient as number,
      input.firstMoment as number,
      input.secondMoment as number,
      input.step as number,
      input.learningRate as number,
      input.betaOne as number,
      input.betaTwo as number,
      input.epsilon as number,
    ),
  }),
});

export const runAdamStep = adamStepTool.execute;
export default adamStepTool;
