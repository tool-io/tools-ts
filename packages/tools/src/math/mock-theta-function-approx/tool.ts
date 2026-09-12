import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQ: number;
  readonly actualTermBudget: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualQ", label: "Actual q", kind: "number" },
  { id: "actualTermBudget", label: "Actual term budget", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (Math.abs(input.actualQ) >= 1) simpleError("q", "Real|q|<1.");
  bounded(input.actualTermBudget, "budget", 1, 256);
  let s = 1,
    p = 1;
  for (let n = 1; n < input.actualTermBudget; n++) {
    p *= 1 + input.actualQ ** n;
    s += input.actualQ ** (n * n) / (p * p);
  }
  return { truncatedThirdOrderMockThetaF: s };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQ: 0.5, actualTermBudget: 2 },
  output: { result: { truncatedThirdOrderMockThetaF: 1.2222222222222223 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/mock-theta-function-approx",
  title: "Mock Theta Function Approximation",
  description:
    "ExplicitRamanujanthirdordermocktheta f(q)=\u03a3q^(n\u00b2)/\u03a0(1+q^k)\u00b2, termsn=0\u2026N\u22121, not unnamed family or analytic continuation. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
