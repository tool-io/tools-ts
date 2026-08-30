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
  readonly lowerIncompleteGammaValue: number;
  readonly regularizedLowerGammaFraction: number;
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
    lowerIncompleteGammaValue: g * r.p,
    regularizedLowerGammaFraction: r.p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { shape: 2, x: 1 } satisfies Input;
export const exampleOutput = {
  lowerIncompleteGammaValue: 0.26424111765711533,
  regularizedLowerGammaFraction: 0.26424111765711533,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/gamma-incomplete-lower-approx",
  title: "Lower Incomplete Gamma Approximation",
  description:
    "Evaluate lower integral γ(a,x) and P separately with stable bounded series/continued-fraction selection; shape>0≤170, x∈[0,10000], normalized and unnormalized values distinct, failed convergence refused.",
  inputs: inputFields,
  outputs: [
    {
      id: "lowerIncompleteGammaValue",
      label: "Lower incomplete gamma value",
      kind: "number",
    },
    {
      id: "regularizedLowerGammaFraction",
      label: "Regularized lower gamma fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ shape: value.shape as number, x: value.x as number }),
});
export const run = tool.execute;
export default tool;
