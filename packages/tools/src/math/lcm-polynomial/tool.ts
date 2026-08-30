import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  polyCoefficients,
  polyLcm,
  polyString,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly leftPolynomial: readonly number[];
  readonly rightPolynomial: readonly number[];
}>;
export type Output = Readonly<{
  readonly monicLcmCoefficients: readonly string[];
}>;
const inputFields = [
  { id: "leftPolynomial", label: "Left polynomial", kind: "numberList" },
  { id: "rightPolynomial", label: "Right polynomial", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = polyCoefficients(input.leftPolynomial, "left"),
    b = polyCoefficients(input.rightPolynomial, "right");
  return { monicLcmCoefficients: polyString(polyLcm(a, b)) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftPolynomial: [-1, 0, 1],
  rightPolynomial: [-2, 1, 1],
} satisfies Input;
export const exampleOutput = {
  monicLcmCoefficients: ["-2", "-1", "2", "1"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/lcm-polynomial",
  title: "Polynomial LCM Calculator",
  description:
    'Exact polynomial LCM over rational coefficients from bounded integer input, normalized monic; zero result is ["0"], rational coefficients are exact decimal numerator/denominator strings.',
  inputs: inputFields,
  outputs: [
    {
      id: "monicLcmCoefficients",
      label: "Monic lcm coefficients",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      leftPolynomial: value.leftPolynomial as readonly number[],
      rightPolynomial: value.rightPolynomial as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
