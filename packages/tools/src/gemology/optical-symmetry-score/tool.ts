import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly alignedOpticalBrightnessMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly normalizedLeftRightOpticalAsymmetry: number;
  readonly normalizedTopBottomOpticalAsymmetry: number;
}>;
const inputFields = [
  {
    id: "alignedOpticalBrightnessMatrix",
    label: "Aligned optical brightness matrix",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = shape(input.alignedOpticalBrightnessMatrix, "brightness");
  let sum = 0,
    lr = 0,
    tb = 0;
  const a = input.alignedOpticalBrightnessMatrix,
    n = a.length;
  a.forEach((r, i) =>
    r.forEach((v, j) => {
      nonnegative(v, "brightness");
      sum += v;
      lr += Math.abs(v - r[m - 1 - j]);
      tb += Math.abs(v - a[n - 1 - i][j]);
    }),
  );
  positive(sum, "totalBrightness");
  return {
    normalizedLeftRightOpticalAsymmetry: lr / (2 * sum),
    normalizedTopBottomOpticalAsymmetry: tb / (2 * sum),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  alignedOpticalBrightnessMatrix: [
    [1, 2],
    [1, 3],
  ],
} satisfies Input;
export const exampleOutput = {
  normalizedLeftRightOpticalAsymmetry: 0.42857142857142855,
  normalizedTopBottomOpticalAsymmetry: 0.14285714285714285,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/optical-symmetry-score",
  title: "Optical Symmetry Score",
  description:
    "Audit aligned image brightness asymmetry about declared horizontal/vertical mirror axes, normalized to total flux; unlike paired physical outline error, illumination/registration remain confounders and no automatic alignment.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedLeftRightOpticalAsymmetry",
      label: "Normalized left right optical asymmetry",
      kind: "number",
    },
    {
      id: "normalizedTopBottomOpticalAsymmetry",
      label: "Normalized top bottom optical asymmetry",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      alignedOpticalBrightnessMatrix:
        value.alignedOpticalBrightnessMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
