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
    truncatedZetaEulerProduct: Math.exp(
      -sum(
        primes(input.actualPrimeCutoff).map((p) =>
          Math.log1p(-(p ** -input.actualRealExponent)),
        ),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRealExponent: 2, actualPrimeCutoff: 3 },
  output: { result: { truncatedZetaEulerProduct: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/euler-product-approx",
  title: "Euler Product Approximation",
  description:
    "Explicit realzetafiniteEulerproduct\u03a0(1\u2212p^\u2212s)^\u22121, s>1, no continuation/tail bound. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
