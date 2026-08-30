import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch-shared.js";
export type Input = Readonly<{
  readonly alternatingSeriesUnsignedTerms: readonly number[];
}>;
export type Output = Readonly<{
  readonly finiteEulerTransformedSum: number;
  readonly forwardDifferenceFirstColumn: readonly number[];
}>;
const inputFields = [
  {
    id: "alternatingSeriesUnsignedTerms",
    label: "Alternating series unsigned terms",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.alternatingSeriesUnsignedTerms.length ||
    input.alternatingSeriesUnsignedTerms.length > 128
  )
    simpleError(
      "terms",
      "1–128 unsigned alternating-series amplitudes required.",
    );
  input.alternatingSeriesUnsignedTerms.forEach((v) => nonnegative(v, "terms"));
  let row = [...input.alternatingSeriesUnsignedTerms],
    s = 0,
    power = 0.5;
  const first: number[] = [];
  while (row.length) {
    first.push(row[0]);
    s += row[0] * power;
    row = row.slice(0, -1).map((v, i) => v - row[i + 1]);
    power /= 2;
  }
  return { finiteEulerTransformedSum: s, forwardDifferenceFirstColumn: first };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  alternatingSeriesUnsignedTerms: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  finiteEulerTransformedSum: 0.5,
  forwardDifferenceFirstColumn: [1, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/euler-transform",
  title: "Euler Transform Calculator",
  description:
    "Compute finite Euler alternating-series transform Σ Δ^k a_0/2^(k+1), using Δa_n=a_n−a_(n+1); preserves finite differences and makes no infinite-series convergence promise.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteEulerTransformedSum",
      label: "Finite euler transformed sum",
      kind: "number",
    },
    {
      id: "forwardDifferenceFirstColumn",
      label: "Forward difference first column",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      alternatingSeriesUnsignedTerms:
        value.alternatingSeriesUnsignedTerms as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
