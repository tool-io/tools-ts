import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{
  readonly x: number;
  readonly realBranch: string;
}>;
export type Output = Readonly<{
  readonly lambertW: number;
  readonly absoluteEquationResidual: number;
}>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
  { id: "realBranch", label: "Real branch", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const x = input.x,
    lower = -1 / Math.E;
  if (input.realBranch !== "principal" && input.realBranch !== "lower")
    simpleError("branch", "Principal or lower real branch required.");
  if (
    x < lower ||
    x > 1000000 ||
    (input.realBranch === "lower" && (x >= 0 || x < lower))
  )
    simpleError(
      "x",
      "Principal branch x≥−1/e or lower branch −1/e≤x<0, x≤10^6 required.",
    );
  if (x === 0) return { lambertW: 0, absoluteEquationResidual: 0 };
  if (Math.abs(x - lower) <= 1e-16)
    return {
      lambertW: -1,
      absoluteEquationResidual: Math.abs(-1 / Math.E - x),
    };
  let lo = input.realBranch === "lower" ? -800 : -1,
    hi =
      input.realBranch === "lower"
        ? -1
        : Math.max(1, Math.log1p(Math.max(0, x)));
  let w = (lo + hi) / 2;
  for (let k = 0; k < 200; k++) {
    const ew = Math.exp(w),
      f = w * ew - x;
    if (input.realBranch === "lower" ? f > 0 : f < 0) lo = w;
    else hi = w;
    const d = ew * (w + 1),
      candidate = w - f / d,
      next =
        Number.isFinite(candidate) && candidate > lo && candidate < hi
          ? candidate
          : (lo + hi) / 2;
    if (Math.abs(next - w) < 1e-14 * Math.max(1, Math.abs(w))) {
      w = next;
      break;
    }
    w = next;
  }
  return {
    lambertW: w,
    absoluteEquationResidual: Math.abs(w * Math.exp(w) - x),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  x: 2.718281828459045,
  realBranch: "principal",
} satisfies Input;
export const exampleOutput = {
  lambertW: 1,
  absoluteEquationResidual: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/lambert-w-approx-newton-xs",
  title: "Lambert W Newton Approximation",
  description:
    "Approximate either real Lambert W branch with safeguarded Newton/bisection and explicit equation residual; lower branch only on [−1/e,0), no complex continuation or false unique root.",
  inputs: inputFields,
  outputs: [
    { id: "lambertW", label: "Lambert w", kind: "number" },
    {
      id: "absoluteEquationResidual",
      label: "Absolute equation residual",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ x: value.x as number, realBranch: value.realBranch as string }),
});
export const run = tool.execute;
export default tool;
