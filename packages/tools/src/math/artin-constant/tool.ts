import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sum,
  primes,
} from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualPrimeCutoff: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualPrimeCutoff", label: "Actual prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualPrimeCutoff, "cutoff", 2, 1000000);
  return {
    truncatedArtinConstant: Math.exp(
      sum(
        primes(input.actualPrimeCutoff).map((p) =>
          Math.log1p(-1 / (p * (p - 1))),
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
  input: { actualPrimeCutoff: 3 },
  output: { result: { truncatedArtinConstant: 0.4166666666666667 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/artin-constant",
  title: "Artin Constant Approximation",
  description:
    "FiniteArtinEulerproduct\u03a0(1\u22121/[p(p\u22121)]), no Artin primitive-root conjecture proof. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
