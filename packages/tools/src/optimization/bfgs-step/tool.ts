import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BfgsStep = {
  readonly direction: number;
  readonly inverseHessian: number;
  readonly parameter: number;
};
export const calculateBfgsStep = (
  previousParameter: number,
  parameter: number,
  previousGradient: number,
  gradient: number,
  inverseHessian: number,
  learningRate: number,
): BfgsStep | null => {
  const displacement = parameter - previousParameter;
  const gradientChange = gradient - previousGradient;
  if (displacement * gradientChange <= 0 || gradientChange === 0) return null;
  const nextInverseHessian = displacement / gradientChange;
  const direction = -nextInverseHessian * gradient;
  const nextParameter = parameter + learningRate * direction;
  return [nextInverseHessian, direction, nextParameter].every(Number.isFinite)
    ? {
        direction: Number(direction.toPrecision(12)),
        inverseHessian: Number(nextInverseHessian.toPrecision(12)),
        parameter: Number(nextParameter.toPrecision(12)),
      }
    : null;
};

export const bfgsStepExample = {
  input: {
    gradient: -2,
    inverseHessian: 1,
    learningRate: 1,
    parameter: 1,
    previousGradient: -4,
    previousParameter: 0,
  },
  output: { result: { direction: 1, inverseHessian: 0.5, parameter: 2 } },
} satisfies ToolExample<
  {
    readonly gradient: number;
    readonly inverseHessian: number;
    readonly learningRate: number;
    readonly parameter: number;
    readonly previousGradient: number;
    readonly previousParameter: number;
  },
  { readonly result: BfgsStep }
>;

export const bfgsStepTool = createSimpleTool({
  id: "optimization/bfgs-step",
  title: "BFGS Optimizer Step Calculator",
  description:
    "Calculate a scalar BFGS inverse-Hessian update and the next parameter step.",
  inputs: [
    { id: "previousParameter", kind: "number", label: "Previous parameter" },
    { id: "parameter", kind: "number", label: "Current parameter" },
    { id: "previousGradient", kind: "number", label: "Previous gradient" },
    { id: "gradient", kind: "number", label: "Current gradient" },
    {
      id: "inverseHessian",
      kind: "number",
      label: "Previous inverse Hessian",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "learningRate",
      kind: "number",
      label: "Learning rate",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "optimizer/bfgs-step",
      id: "result",
      kind: "object",
      label: "BFGS step",
    },
  ],
  calculate: (input) => {
    const result = calculateBfgsStep(
      input.previousParameter as number,
      input.parameter as number,
      input.previousGradient as number,
      input.gradient as number,
      input.inverseHessian as number,
      input.learningRate as number,
    );
    if (!result)
      return simpleError(
        "gradient",
        "The parameter and gradient changes must satisfy positive curvature.",
      );
    return { result };
  },
});

export const runBfgsStep = bfgsStepTool.execute;
export default bfgsStepTool;
