import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  determinant,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualFirstQuadraticDescendingCoefficients: readonly number[];
  readonly actualSecondQuadraticDescendingCoefficients: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstQuadraticDescendingCoefficients",
    label: "Actual first quadratic descending coefficients",
    kind: "numberList",
  },
  {
    id: "actualSecondQuadraticDescendingCoefficients",
    label: "Actual second quadratic descending coefficients",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualFirstQuadraticDescendingCoefficients.length !== 3 ||
    input.actualSecondQuadraticDescendingCoefficients.length !== 3 ||
    input.actualFirstQuadraticDescendingCoefficients[0] === 0 ||
    input.actualSecondQuadraticDescendingCoefficients[0] === 0
  )
    simpleError("quadratics", "Actualdegree-two3coefficientsleadingnonzero.");
  const [a, b, c] = input.actualFirstQuadraticDescendingCoefficients,
    [d, e, f] = input.actualSecondQuadraticDescendingCoefficients;
  return {
    quadraticResultant: determinant([
      [a, b, c, 0],
      [0, a, b, c],
      [d, e, f, 0],
      [0, d, e, f],
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFirstQuadraticDescendingCoefficients: [1, 0, -1],
    actualSecondQuadraticDescendingCoefficients: [1, 0, -4],
  },
  output: { result: { quadraticResultant: 9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/resultant-two-quadratics",
  title: "Resultant of Two Quadratics Calculator",
  description:
    "Degree-two Sylvester resultant actual descending coefficients, sign conventionRes(f, g), not discriminant or fully solve common roots.",
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
