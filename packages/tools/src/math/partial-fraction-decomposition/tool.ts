import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, partialFractions } from "../batch-shared.js";
export type Input = Readonly<{
  readonly numeratorCoefficients: readonly number[];
  readonly suppliedSimpleRealPoles: readonly number[];
}>;
export type Output = Readonly<{
  readonly simplePoleResidues: readonly number[];
}>;
const inputFields = [
  {
    id: "numeratorCoefficients",
    label: "Numerator coefficients",
    kind: "numberList",
  },
  {
    id: "suppliedSimpleRealPoles",
    label: "Supplied simple real poles",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    simplePoleResidues: partialFractions(
      input.numeratorCoefficients,
      input.suppliedSimpleRealPoles,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  numeratorCoefficients: [1],
  suppliedSimpleRealPoles: [1, 2],
} satisfies Input;
export const exampleOutput = { simplePoleResidues: [-1, 1] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/partial-fraction-decomposition",
  title: "Partial Fraction Decomposition Tool",
  description:
    "Decompose a strictly proper rational function whose monic denominator is caller supplied product of distinct simple real (x−pole) factors; residues computed by p(pole)/q′(pole), not a general factoring claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "simplePoleResidues",
      label: "Simple pole residues",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      numeratorCoefficients: value.numeratorCoefficients as readonly number[],
      suppliedSimpleRealPoles:
        value.suppliedSimpleRealPoles as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
