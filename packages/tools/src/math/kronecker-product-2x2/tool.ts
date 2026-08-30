import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape } from "../batch-shared.js";
export type Input = Readonly<{
  readonly leftMatrix: readonly (readonly number[])[];
  readonly rightMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly kroneckerProduct: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "leftMatrix", label: "Left matrix", kind: "matrix" },
  { id: "rightMatrix", label: "Right matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.leftMatrix, "left") !== 2 ||
    input.leftMatrix.length !== 2 ||
    shape(input.rightMatrix, "right") !== 2 ||
    input.rightMatrix.length !== 2
  )
    simpleError("matrices", "Two 2×2 matrices required.");
  return {
    kroneckerProduct: Array.from({ length: 4 }, (_, i) =>
      Array.from(
        { length: 4 },
        (_, j) =>
          input.leftMatrix[Math.floor(i / 2)][Math.floor(j / 2)] *
          input.rightMatrix[i % 2][j % 2],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftMatrix: [
    [1, 2],
    [3, 4],
  ],
  rightMatrix: [
    [0, 5],
    [6, 7],
  ],
} satisfies Input;
export const exampleOutput = {
  kroneckerProduct: [
    [0, 5, 0, 10],
    [6, 7, 12, 14],
    [0, 15, 0, 20],
    [18, 21, 24, 28],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/kronecker-product-2x2",
  title: "2x2 Kronecker Product Calculator",
  description:
    "Construct 4×4 Kronecker block product from two real 2×2 matrices; distinct from matrix multiplication, Hadamard elementwise product and number-theoretic Kronecker symbol.",
  inputs: inputFields,
  outputs: [
    { id: "kroneckerProduct", label: "Kronecker product", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({
      leftMatrix: value.leftMatrix as readonly (readonly number[])[],
      rightMatrix: value.rightMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
