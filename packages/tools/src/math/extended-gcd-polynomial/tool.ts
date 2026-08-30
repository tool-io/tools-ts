import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  polyCoefficients,
  polyExtended,
  polyString,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly leftPolynomial: readonly number[];
  readonly rightPolynomial: readonly number[];
}>;
export type Output = Readonly<{
  readonly monicGcdCoefficients: readonly string[];
  readonly leftBezoutCoefficients: readonly string[];
  readonly rightBezoutCoefficients: readonly string[];
}>;
const inputFields = [
  { id: "leftPolynomial", label: "Left polynomial", kind: "numberList" },
  { id: "rightPolynomial", label: "Right polynomial", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const r = polyExtended(
    polyCoefficients(input.leftPolynomial, "left"),
    polyCoefficients(input.rightPolynomial, "right"),
  );
  return {
    monicGcdCoefficients: polyString(r.gcd),
    leftBezoutCoefficients: polyString(r.u),
    rightBezoutCoefficients: polyString(r.v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftPolynomial: [-1, 0, 1],
  rightPolynomial: [-1, 1],
} satisfies Input;
export const exampleOutput = {
  monicGcdCoefficients: ["-1", "1"],
  leftBezoutCoefficients: ["0"],
  rightBezoutCoefficients: ["1"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/extended-gcd-polynomial",
  title: "Extended GCD Polynomial Calculator",
  description:
    "Compute exact rational polynomial Bézout witnesses u*f+v*g=monic gcd for degree≤12 integer input; coefficient strings preserve fractions and zero/zero returns all zeros.",
  inputs: inputFields,
  outputs: [
    {
      id: "monicGcdCoefficients",
      label: "Monic gcd coefficients",
      kind: "stringList",
    },
    {
      id: "leftBezoutCoefficients",
      label: "Left bezout coefficients",
      kind: "stringList",
    },
    {
      id: "rightBezoutCoefficients",
      label: "Right bezout coefficients",
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
