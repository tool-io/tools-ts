import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rationalApprox } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFiniteReal: number;
  readonly actualMaximumDenominator: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFiniteReal", label: "Actual finite real", kind: "number" },
  {
    id: "actualMaximumDenominator",
    label: "Actual maximum denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return rationalApprox(input.actualFiniteReal, input.actualMaximumDenominator);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFiniteReal: 0.3, actualMaximumDenominator: 10 },
  output: { result: { numerator: 3, denominator: 10, absoluteError: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/dirichlet-approximation",
  title: "Dirichlet Approximation Calculator",
  description:
    "Observed nearest numerator rational search denominator1\u2026Qminabsoluteerror, earliest denominator ties; Dirichlet theorem not certified for irrational actual represented float from finite search, no infinite quantifier. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
