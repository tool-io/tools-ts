import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  tensor,
} from "../shared.js";
export type Input = Readonly<{
  readonly eigenvalues: readonly (readonly number[])[];
  readonly voxelWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly voxelFa: readonly number[];
  readonly weightedMeanFa: number;
}>;
const inputFields = [
  { id: "eigenvalues", label: "Eigenvalues", kind: "matrix" },
  { id: "voxelWeights", label: "Voxel weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.eigenvalues, input.voxelWeights, "eigenvalues");
  input.voxelWeights.forEach((v) => nonnegative(v, "voxelWeights"));
  const total = positive(
      input.voxelWeights.reduce((a, b) => a + b, 0),
      "voxelWeights",
    ),
    voxelFa = input.eigenvalues.map((v) => tensor(v).fractionalAnisotropy);
  return {
    voxelFa,
    weightedMeanFa:
      voxelFa.reduce((s, v, i) => s + v * input.voxelWeights[i], 0) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eigenvalues: [
    [1, 1, 1],
    [2, 0, 0],
  ],
  voxelWeights: [1, 3],
} satisfies Input;
export const exampleOutput = {
  voxelFa: [0, 1],
  weightedMeanFa: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/roi-tensor-fractional-anisotropy",
  title: "Average Fractional Anisotropy",
  description:
    "Compute voxel FA from nonnegative tensor eigenvalues and an ROI-weighted average, rather than averaging tensor eigenvalues before deriving FA.",
  inputs: inputFields,
  outputs: [
    { id: "voxelFa", label: "Voxel fa", kind: "numberList" },
    { id: "weightedMeanFa", label: "Weighted mean fa", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      eigenvalues: value.eigenvalues as readonly (readonly number[])[],
      voxelWeights: value.voxelWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
