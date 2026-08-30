import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  polyCoefficients,
  resultant,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly leftPolynomial: readonly number[];
  readonly rightPolynomial: readonly number[];
}>;
export type Output = Readonly<{
  readonly exactSylvesterResultant: string;
  readonly commonRootOverAlgebraicClosure: boolean;
}>;
const inputFields = [
  { id: "leftPolynomial", label: "Left polynomial", kind: "numberList" },
  { id: "rightPolynomial", label: "Right polynomial", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = polyCoefficients(input.leftPolynomial, "left"),
    b = polyCoefficients(input.rightPolynomial, "right");
  const r = resultant(a, b);
  return {
    exactSylvesterResultant: r.toString(),
    commonRootOverAlgebraicClosure:
      (a.length === 1 && a[0][0] !== 0n) || (b.length === 1 && b[0][0] !== 0n)
        ? false
        : r === 0n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftPolynomial: [-1, 1],
  rightPolynomial: [-2, 1],
} satisfies Input;
export const exampleOutput = {
  exactSylvesterResultant: "-1",
  commonRootOverAlgebraicClosure: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/resultant-sylvester",
  title: "Sylvester Resultant Calculator",
  description:
    "Compute exact integer resultant by fraction-free Sylvester determinant for constant-first integer polynomials of degree ≤12; zero polynomial returns zero resultant. Nonzero constants have no common roots.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactSylvesterResultant",
      label: "Exact sylvester resultant",
      kind: "string",
    },
    {
      id: "commonRootOverAlgebraicClosure",
      label: "Common root over algebraic closure",
      kind: "boolean",
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
