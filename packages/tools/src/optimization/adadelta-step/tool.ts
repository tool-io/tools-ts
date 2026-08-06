import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AdaDeltaStep = {
  readonly averageSquaredGradient: number;
  readonly averageSquaredUpdate: number;
  readonly parameter: number;
  readonly update: number;
};
const round = (value: number): number => Number(value.toPrecision(12));
export const calculateAdaDeltaStep = (
  parameter: number,
  gradient: number,
  averageSquaredGradient: number,
  averageSquaredUpdate: number,
  decayRate: number,
  epsilon: number,
): AdaDeltaStep => {
  const nextAverageSquaredGradient =
    decayRate * averageSquaredGradient + (1 - decayRate) * gradient ** 2;
  const update =
    -Math.sqrt(
      (averageSquaredUpdate + epsilon) / (nextAverageSquaredGradient + epsilon),
    ) * gradient;
  const nextAverageSquaredUpdate =
    decayRate * averageSquaredUpdate + (1 - decayRate) * update ** 2;
  return {
    averageSquaredGradient: round(nextAverageSquaredGradient),
    averageSquaredUpdate: round(nextAverageSquaredUpdate),
    parameter: round(parameter + update),
    update: round(update),
  };
};

export const adaDeltaStepExample = {
  input: {
    averageSquaredGradient: 0,
    averageSquaredUpdate: 0,
    decayRate: 0.95,
    epsilon: 0.000001,
    gradient: 0.1,
    parameter: 1,
  },
  output: {
    result: {
      averageSquaredGradient: 0.0005,
      averageSquaredUpdate: 9.98003992016e-7,
      parameter: 0.995532329484,
      update: -0.00446767051609,
    },
  },
} satisfies ToolExample<
  {
    readonly averageSquaredGradient: number;
    readonly averageSquaredUpdate: number;
    readonly decayRate: number;
    readonly epsilon: number;
    readonly gradient: number;
    readonly parameter: number;
  },
  { readonly result: AdaDeltaStep }
>;

export const adaDeltaStepTool = createSimpleTool({
  id: "optimization/adadelta-step",
  title: "AdaDelta Optimizer Step Calculator",
  description:
    "Calculate one scalar AdaDelta parameter update and its accumulated state.",
  inputs: [
    { id: "parameter", kind: "number", label: "Parameter" },
    { id: "gradient", kind: "number", label: "Gradient" },
    {
      id: "averageSquaredGradient",
      kind: "number",
      label: "Average squared gradient",
      minimum: 0,
    },
    {
      id: "averageSquaredUpdate",
      kind: "number",
      label: "Average squared update",
      minimum: 0,
    },
    {
      id: "decayRate",
      kind: "number",
      label: "Decay rate",
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
      format: "optimizer/adadelta-step",
      id: "result",
      kind: "object",
      label: "AdaDelta step",
    },
  ],
  calculate: (input) => ({
    result: calculateAdaDeltaStep(
      input.parameter as number,
      input.gradient as number,
      input.averageSquaredGradient as number,
      input.averageSquaredUpdate as number,
      input.decayRate as number,
      input.epsilon as number,
    ),
  }),
});

export const runAdaDeltaStep = adaDeltaStepTool.execute;
export default adaDeltaStepTool;
