import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape } from "../batch-shared.js";
export type Input = Readonly<{
  readonly matrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly characteristicPolynomialConstantFirst: readonly number[];
}>;
const inputFields = [
  { id: "matrix", label: "Matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (shape(input.matrix, "matrix") !== 2 || input.matrix.length !== 2)
    simpleError("matrix", "Exactly 2×2 matrix required.");
  const [[a, b], [c, d]] = input.matrix;
  return { characteristicPolynomialConstantFirst: [a * d - b * c, -a - d, 1] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  matrix: [
    [1, 2],
    [3, 4],
  ],
} satisfies Input;
export const exampleOutput = {
  characteristicPolynomialConstantFirst: [-2, -5, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/characteristic-polynomial-2x2",
  title: "2x2 Characteristic Polynomial Calculator",
  description:
    "Construct det(λI−A) in ascending coefficient order for real 2×2 input, not a generic trace/determinant alias; preserves full characteristic polynomial.",
  inputs: inputFields,
  outputs: [
    {
      id: "characteristicPolynomialConstantFirst",
      label: "Characteristic polynomial constant first",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({ matrix: value.matrix as readonly (readonly number[])[] }),
});
export const run = tool.execute;
export default tool;
