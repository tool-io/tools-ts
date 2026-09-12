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
  if (input.actualExponent % 2 !== 1)
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
  input: { actualExponent: 3, actualTermBudget: 10 },
  output: {
    result: {
      partialValue: 1.1975319856741933,
      integralLowerTail: 0.004132231404958678,
      integralUpperTail: 0.005,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/zeta-odd-approx",
  title: "Odd Zeta Approximation",
  description:
    "Real positive odd zetaseriessumthroughNwithmonotoneintegral tail bounds, no analytic continuation or rounded partial as exact\u03b6. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
