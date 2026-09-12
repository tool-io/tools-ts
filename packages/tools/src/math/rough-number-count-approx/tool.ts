import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, smoothCount } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCutoff: number;
  readonly actualPrimeFactorBoundary: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualCutoff", label: "Actual cutoff", kind: "number" },
  {
    id: "actualPrimeFactorBoundary",
    label: "Actual prime factor boundary",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    exactObservedCount: smoothCount(
      input.actualCutoff,
      input.actualPrimeFactorBoundary,
      false,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCutoff: 10, actualPrimeFactorBoundary: 3 },
  output: { result: { exactObservedCount: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/rough-number-count-approx",
  title: "Rough Number Count Approximation",
  description:
    "ExactfiniteBrough(all prime factors\u2265B) count1\u2264m\u2264N, included1by empty factor convention, N\u22641e5. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
