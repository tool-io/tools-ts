import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NewtonStep = { readonly parameter: number; readonly step: number };
export const calculateNewtonStep = (
  parameter: number,
  gradient: number,
  hessian: number,
  damping: number,
): NewtonStep | null => {
  if (hessian === 0) return null;
  const step = (damping * gradient) / hessian;
  const nextParameter = parameter - step;
  return [step, nextParameter].every(Number.isFinite)
    ? {
        parameter: Number(nextParameter.toPrecision(12)),
        step: Number(step.toPrecision(12)),
      }
    : null;
};

export const newtonStepExample = {
  input: { damping: 1, gradient: 6, hessian: 2, parameter: 4 },
  output: { result: { parameter: 1, step: 3 } },
} satisfies ToolExample<
  {
    readonly damping: number;
    readonly gradient: number;
    readonly hessian: number;
    readonly parameter: number;
  },
  { readonly result: NewtonStep }
>;

export const newtonStepTool = createSimpleTool({
  id: "optimization/newton-step",
  title: "Newton Optimizer Step Calculator",
  description:
    "Calculate one damped scalar Newton optimization step from a gradient and Hessian.",
  inputs: [
    { id: "parameter", kind: "number", label: "Parameter" },
    { id: "gradient", kind: "number", label: "Gradient" },
    { id: "hessian", kind: "number", label: "Hessian" },
    {
      id: "damping",
      kind: "number",
      label: "Damping",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "optimizer/newton-step",
      id: "result",
      kind: "object",
      label: "Newton step",
    },
  ],
  calculate: (input) => {
    const result = calculateNewtonStep(
      input.parameter as number,
      input.gradient as number,
      input.hessian as number,
      input.damping as number,
    );
    if (!result)
      return simpleError(
        "hessian",
        "Hessian must be nonzero and produce a finite step.",
      );
    return { result };
  },
});

export const runNewtonStep = newtonStepTool.execute;
export default newtonStepTool;
