import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, tauCoefficient } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualCoefficientIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCoefficientIndex",
    label: "Actual coefficient index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    exactTauCoefficient: tauCoefficient(
      input.actualCoefficientIndex,
    ).toString(),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCoefficientIndex: 3 },
  output: { result: { exactTauCoefficient: "252" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/ramanujan-tau-approx",
  title: "Ramanujan Tau Approximation",
  description:
    "Exact Ramanujan\u03c4(n) coefficientq^nofq\u03a0(1\u2212q^k)^24via finite integer polynomial, n\u226464. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
