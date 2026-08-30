import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, hypergeometric } from "../batch-shared.js";
export type Input = Readonly<{
  readonly a: number;
  readonly c: number;
  readonly x: number;
  readonly seriesTerms: number;
}>;
export type Output = Readonly<{
  readonly finiteHypergeometricSum: number;
  readonly lastIncludedTermMagnitude: number;
  readonly polynomialTerminationObserved: boolean;
}>;
const inputFields = [
  { id: "a", label: "A", kind: "number" },
  { id: "c", label: "C", kind: "number" },
  { id: "x", label: "X", kind: "number" },
  { id: "seriesTerms", label: "Series terms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const r = hypergeometric(
    input.a,
    1,
    input.c,
    input.x,
    true,
    input.seriesTerms,
  );
  return {
    finiteHypergeometricSum: r.value,
    lastIncludedTermMagnitude: r.lastTermMagnitude,
    polynomialTerminationObserved: r.terminated,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  a: 1,
  c: 2,
  x: 0.5,
  seriesTerms: 4,
} satisfies Input;
export const exampleOutput = {
  finiteHypergeometricSum: 1.296875,
  lastIncludedTermMagnitude: 0.005208333333333333,
  polynomialTerminationObserved: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/confluent-hypergeometric-1f1-approx",
  title: "Confluent Hypergeometric 1F1 Approximation",
  description:
    "Compute finite confluent 1F1(a;c;x) power series with explicit included term count, last term and observed numerator termination; denominator poles rejected, last term is not a tail bound or convergence certificate.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteHypergeometricSum",
      label: "Finite hypergeometric sum",
      kind: "number",
    },
    {
      id: "lastIncludedTermMagnitude",
      label: "Last included term magnitude",
      kind: "number",
    },
    {
      id: "polynomialTerminationObserved",
      label: "Polynomial termination observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      a: value.a as number,
      c: value.c as number,
      x: value.x as number,
      seriesTerms: value.seriesTerms as number,
    }),
});
export const run = tool.execute;
export default tool;
