import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, primes } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualCutoff: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualCutoff", label: "Actual cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualCutoff, "cutoff", 1, 100000);
  let total = 0;
  const p = primes(input.actualCutoff);
  for (let i = 0; i < p.length; i++)
    for (let j = i; j < p.length && p[i] * p[j] <= input.actualCutoff; j++)
      total++;
  return { exactObservedSemiprimeCount: total };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCutoff: 10 },
  output: { result: { exactObservedSemiprimeCount: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/semiprime-count-approx",
  title: "Semiprime Count Approximation",
  description:
    "Exactfinitecountsemiprimespq\u2264Nincludingp=q, not invalid asymptotic at smallN. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
