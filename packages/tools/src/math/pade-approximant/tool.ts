import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pade } from "../batch-shared.js";
export type Input = Readonly<{
  readonly taylorCoefficients: readonly number[];
  readonly numeratorDegree: number;
  readonly denominatorDegree: number;
}>;
export type Output = Readonly<{
  readonly numeratorCoefficients: readonly number[];
  readonly denominatorCoefficients: readonly number[];
}>;
const inputFields = [
  {
    id: "taylorCoefficients",
    label: "Taylor coefficients",
    kind: "numberList",
  },
  { id: "numeratorDegree", label: "Numerator degree", kind: "number" },
  { id: "denominatorDegree", label: "Denominator degree", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const r = pade(
    input.taylorCoefficients,
    input.numeratorDegree,
    input.denominatorDegree,
  );
  return {
    numeratorCoefficients: r.numerator,
    denominatorCoefficients: r.denominator,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  taylorCoefficients: [1, 1, 0.5],
  numeratorDegree: 1,
  denominatorDegree: 1,
} satisfies Input;
export const exampleOutput = {
  numeratorCoefficients: [1, 0.5],
  denominatorCoefficients: [1, -0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/pade-approximant",
  title: "Padé Approximant Calculator",
  description:
    "Solve bounded [m/n] Padé approximant from exactly m+n+1 caller Taylor coefficients, denominator constant one; singular/unresolved systems refused rather than invent a unique approximation.",
  inputs: inputFields,
  outputs: [
    {
      id: "numeratorCoefficients",
      label: "Numerator coefficients",
      kind: "numberList",
    },
    {
      id: "denominatorCoefficients",
      label: "Denominator coefficients",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      taylorCoefficients: value.taylorCoefficients as readonly number[],
      numeratorDegree: value.numeratorDegree as number,
      denominatorDegree: value.denominatorDegree as number,
    }),
});
export const run = tool.execute;
export default tool;
