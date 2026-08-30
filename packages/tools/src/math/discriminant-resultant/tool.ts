import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  polyCoefficients,
  discriminant,
} from "../batch-shared.js";
export type Input = Readonly<{ readonly coefficients: readonly number[] }>;
export type Output = Readonly<{
  readonly exactPolynomialDiscriminant: string;
  readonly hasRepeatedComplexRoot: boolean;
}>;
const inputFields = [
  { id: "coefficients", label: "Coefficients", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = polyCoefficients(input.coefficients),
    d = discriminant(p);
  return {
    exactPolynomialDiscriminant: d.toString(),
    hasRepeatedComplexRoot: d === 0n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { coefficients: [-1, 0, 1] } satisfies Input;
export const exampleOutput = {
  exactPolynomialDiscriminant: "4",
  hasRepeatedComplexRoot: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/discriminant-resultant",
  title: "Discriminant Resultant Calculator",
  description:
    "Compute exact degree-general integer polynomial discriminant from signed derivative resultant divided by leading coefficient; constant-first degree 1–12, no separate cubic/quartic aliases or real-root-count inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactPolynomialDiscriminant",
      label: "Exact polynomial discriminant",
      kind: "string",
    },
    {
      id: "hasRepeatedComplexRoot",
      label: "Has repeated complex root",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ coefficients: value.coefficients as readonly number[] }),
});
export const run = tool.execute;
export default tool;
