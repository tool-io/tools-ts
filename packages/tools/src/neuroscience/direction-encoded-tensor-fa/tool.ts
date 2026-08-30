import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, norm, tensor } from "../shared.js";
export type Input = Readonly<{
  readonly eigenvalues: readonly number[];
  readonly principalDirection: readonly number[];
}>;
export type Output = Readonly<{
  readonly fractionalAnisotropy: number;
  readonly rgbFractions: readonly number[];
  readonly rgb8Bit: readonly number[];
}>;
const inputFields = [
  { id: "eigenvalues", label: "Eigenvalues", kind: "numberList" },
  {
    id: "principalDirection",
    label: "Principal direction",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.principalDirection.length !== 3)
    simpleError(
      "principalDirection",
      "Three-component principal eigenvector required.",
    );
  const length = positive(norm(input.principalDirection), "principalDirection"),
    fractionalAnisotropy = tensor(input.eigenvalues).fractionalAnisotropy,
    rgbFractions = input.principalDirection.map(
      (v) => (Math.abs(v) / length) * fractionalAnisotropy,
    );
  return {
    fractionalAnisotropy,
    rgbFractions,
    rgb8Bit: rgbFractions.map((v) => Math.round(255 * v)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eigenvalues: [2, 0, 0],
  principalDirection: [-1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  fractionalAnisotropy: 1,
  rgbFractions: [1, 0, 0],
  rgb8Bit: [255, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/direction-encoded-tensor-fa",
  title: "Color Coded Fractional Anisotropy",
  description:
    "Compute FA-weighted absolute principal-direction RGB and rounded 8-bit channels; coordinate-axis orientation must match the caller’s image convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "fractionalAnisotropy",
      label: "Fractional anisotropy",
      kind: "number",
    },
    { id: "rgbFractions", label: "Rgb fractions", kind: "numberList" },
    { id: "rgb8Bit", label: "Rgb8 bit", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      eigenvalues: value.eigenvalues as readonly number[],
      principalDirection: value.principalDirection as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
