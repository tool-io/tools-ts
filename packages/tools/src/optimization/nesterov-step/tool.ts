import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type NesterovStep = {
  readonly lookahead: number;
  readonly parameter: number;
  readonly velocity: number;
};
export const calculateNesterovStep = (
  parameter: number,
  velocity: number,
  lookaheadGradient: number,
  learningRate: number,
  momentum: number,
): NesterovStep => {
  const lookahead = parameter + momentum * velocity;
  const nextVelocity = momentum * velocity - learningRate * lookaheadGradient;
  return {
    lookahead: Number(lookahead.toPrecision(12)),
    parameter: Number((parameter + nextVelocity).toPrecision(12)),
    velocity: Number(nextVelocity.toPrecision(12)),
  };
};

export const nesterovStepExample = {
  input: {
    learningRate: 0.1,
    lookaheadGradient: 0.5,
    momentum: 0.9,
    parameter: 1,
    velocity: 0.2,
  },
  output: { result: { lookahead: 1.18, parameter: 1.13, velocity: 0.13 } },
} satisfies ToolExample<
  {
    readonly learningRate: number;
    readonly lookaheadGradient: number;
    readonly momentum: number;
    readonly parameter: number;
    readonly velocity: number;
  },
  { readonly result: NesterovStep }
>;

export const nesterovStepTool = createSimpleTool({
  id: "optimization/nesterov-step",
  title: "Nesterov Accelerated-Gradient Step",
  description:
    "Calculate one scalar Nesterov momentum update from a gradient evaluated at the lookahead point.",
  inputs: [
    { id: "parameter", kind: "number", label: "Parameter" },
    { id: "velocity", kind: "number", label: "Velocity" },
    { id: "lookaheadGradient", kind: "number", label: "Lookahead gradient" },
    {
      id: "learningRate",
      kind: "number",
      label: "Learning rate",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "momentum",
      kind: "number",
      label: "Momentum",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "optimizer/nesterov-step",
      id: "result",
      kind: "object",
      label: "Nesterov step",
    },
  ],
  calculate: (input) => ({
    result: calculateNesterovStep(
      input.parameter as number,
      input.velocity as number,
      input.lookaheadGradient as number,
      input.learningRate as number,
      input.momentum as number,
    ),
  }),
});

export const runNesterovStep = nesterovStepTool.execute;
export default nesterovStepTool;
