import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualOrderedTensorEigenvalues: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOrderedTensorEigenvalues",
    label: "Actual ordered tensor eigenvalues",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualOrderedTensorEigenvalues.length)
    simpleError(
      "actualOrderedTensorEigenvalues",
      "Actual nonempty observations.",
    );
  input.actualOrderedTensorEigenvalues.forEach((v) =>
    nonnegative(v, "actualOrderedTensorEigenvalues"),
  );
  if (
    input.actualOrderedTensorEigenvalues.length !== 3 ||
    input.actualOrderedTensorEigenvalues.some(
      (v, i) => i && v > input.actualOrderedTensorEigenvalues[i - 1],
    )
  )
    simpleError("eigenvalues", "Actualthreeorderednonnegativeeigenvalues.");
  return {
    value:
      (input.actualOrderedTensorEigenvalues[1] +
        input.actualOrderedTensorEigenvalues[2]) /
      2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOrderedTensorEigenvalues: [3, 2, 1] },
  output: { result: { value: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/radial-diffusivity-mri",
  title: "Radial Diffusivity MRI Calculator",
  description:
    "Actual radial diffusivity RD=(\u03bb2+\u03bb3)/2, independently fit positive-semi definite diffusion tensor \u03bb1\u2265\u03bb2\u2265\u03bb3\u22650, units retained. Not mean of all3or eigen fit from signal.",
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
