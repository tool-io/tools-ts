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
  const a = rationalApprox(
    input.actualFiniteReal,
    input.actualMaximumDenominator,
  );
  const bound = 1 / (Math.sqrt(5) * a.denominator * a.denominator);
  return {
    ...a,
    hurwitzStrictErrorBound: bound,
    observedWitnessWithinStrictBound: a.absoluteError < bound,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFiniteReal: 0.3, actualMaximumDenominator: 10 },
  output: {
    result: {
      numerator: 3,
      denominator: 10,
      absoluteError: 0,
      hurwitzStrictErrorBound: 0.00447213595499958,
      observedWitnessWithinStrictBound: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/hurwitz-approximation",
  title: "Hurwitz Approximation Calculator",
  description:
    "Finite Hurwitz-quality witness search among denominator1\u2026Q, earliest denominator ties; report actual absolute error and strict1/(sqrt5 q\u00b2) bound independently for selected observed witness. Does not certify representedinputirrationality or theorem infinitely many rational approximants; bounded float observations only.",
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
