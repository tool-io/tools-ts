import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  sum,
  primes,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRealExponent: number;
  readonly actualPrimeCutoff: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualRealExponent", label: "Actual real exponent", kind: "number" },
  { id: "actualPrimeCutoff", label: "Actual prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualRealExponent - 1, "s>1");
  bounded(input.actualPrimeCutoff, "cutoff", 2, 1000000);
  return {
    partialPrimeZeta: sum(
      primes(input.actualPrimeCutoff).map(
        (p) => p ** -input.actualRealExponent,
      ),
    ),
    integerIntegralUpperTail:
      input.actualPrimeCutoff ** (1 - input.actualRealExponent) /
      (input.actualRealExponent - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRealExponent: 2, actualPrimeCutoff: 7 },
  output: {
    result: {
      partialPrimeZeta: 0.42151927437641723,
      integerIntegralUpperTail: 0.14285714285714285,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/prime-zeta-approx",
  title: "Prime Zeta Approximation",
  description:
    "Real prime zeta sum over actual primes\u2264cutoff, s>1, conservativeALL-integer integral tail upper bound; not sum overall integers\u03b6. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
