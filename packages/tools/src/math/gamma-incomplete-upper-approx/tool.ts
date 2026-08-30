import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  shape,
  gamma,
  gammaRatios,
} from "../batch-shared.js";
export type Input = Readonly<{ readonly shape: number; readonly x: number }>;
export type Output = Readonly<{
  readonly upperIncompleteGammaValue: number;
  readonly regularizedUpperGammaFraction: number;
}>;
const inputFields = [
  { id: "shape", label: "Shape", kind: "number" },
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.shape > 170)
    simpleError(
      "shape",
      "Unregularized finite gamma output requires shape≤170.",
    );
  const r = gammaRatios(input.shape, input.x),
    g = gamma(input.shape);
  return {
    upperIncompleteGammaValue: g * r.q,
    regularizedUpperGammaFraction: r.q,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { shape: 2, x: 1 } satisfies Input;
export const exampleOutput = {
  upperIncompleteGammaValue: 0.7357588823428847,
  regularizedUpperGammaFraction: 0.7357588823428847,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/gamma-incomplete-upper-approx",
  title: "Upper Incomplete Gamma Approximation",
  description:
    "Evaluate upper tail Γ(a,x) and Q separately with stable bounded series/continued-fraction selection; shape>0≤170, x∈[0,10000], normalized and unnormalized values distinct, failed convergence refused.",
  inputs: inputFields,
  outputs: [
    {
      id: "upperIncompleteGammaValue",
      label: "Upper incomplete gamma value",
      kind: "number",
    },
    {
      id: "regularizedUpperGammaFraction",
      label: "Regularized upper gamma fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ shape: value.shape as number, x: value.x as number }),
});
export const run = tool.execute;
export default tool;
