import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualExponent: number;
  readonly actualTermBudget: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualExponent", label: "Actual exponent", kind: "number" },
  { id: "actualTermBudget", label: "Actual term budget", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualExponent, "exponent", 2, 64);
  bounded(input.actualTermBudget, "budget", 1, 100000);
  if (input.actualExponent % 2 !== 0)
    simpleError("parity", "Namedexponentparityrequired.");
  let s = 0;
  for (let k = 1; k <= input.actualTermBudget; k++)
    s += k ** -input.actualExponent;
  return {
    partialValue: s,
    integralLowerTail:
      (input.actualTermBudget + 1) ** (1 - input.actualExponent) /
      (input.actualExponent - 1),
    integralUpperTail:
      input.actualTermBudget ** (1 - input.actualExponent) /
      (input.actualExponent - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualExponent: 2, actualTermBudget: 10 },
  output: {
    result: {
      partialValue: 1.5497677311665408,
      integralLowerTail: 0.09090909090909091,
      integralUpperTail: 0.1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/riemann-zeta-approx-even",
  title: "Riemann Zeta Even Approximation",
  description:
    "Real positive even zetaseriessumthroughNwithmonotoneintegral tail bounds, no analytic continuation or rounded partial as exact\u03b6. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
