import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, factorial } from "../batch-shared.js";
export type Input = Readonly<{
  readonly derivativeOrder: number;
  readonly x: number;
  readonly seriesTerms: number;
}>;
export type Output = Readonly<{
  readonly truncatedPolygammaValue: number;
  readonly absoluteTailUpperBound: number;
}>;
const inputFields = [
  { id: "derivativeOrder", label: "Derivative order", kind: "number" },
  { id: "x", label: "X", kind: "number" },
  { id: "seriesTerms", label: "Series terms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = bounded(input.derivativeOrder, "order", 1, 6),
    n = bounded(input.seriesTerms, "terms", 1, 100000);
  if (input.x <= 0 || input.x > 1000000)
    simpleError("x", "Positive x≤10^6 required.");
  let sum = 0;
  for (let k = 0; k < n; k++) sum += (input.x + k) ** (-m - 1);
  const factor = Number(factorial(m)),
    sign = m % 2 ? 1 : -1;
  return {
    truncatedPolygammaValue: sign * factor * sum,
    absoluteTailUpperBound: (factor * (input.x + n - 1) ** -m) / m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  derivativeOrder: 1,
  x: 1,
  seriesTerms: 3,
} satisfies Input;
export const exampleOutput = {
  truncatedPolygammaValue: 1.3611111111111112,
  absoluteTailUpperBound: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/polygamma-approx",
  title: "Polygamma Approximation",
  description:
    "Approximate ψ^(m)(x) for positive x and integer m=1..6 via finite absolutely convergent reciprocal-power series, with integral-test absolute tail upper bound; finite truncation not hidden exact value.",
  inputs: inputFields,
  outputs: [
    {
      id: "truncatedPolygammaValue",
      label: "Truncated polygamma value",
      kind: "number",
    },
    {
      id: "absoluteTailUpperBound",
      label: "Absolute tail upper bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      derivativeOrder: value.derivativeOrder as number,
      x: value.x as number,
      seriesTerms: value.seriesTerms as number,
    }),
});
export const run = tool.execute;
export default tool;
