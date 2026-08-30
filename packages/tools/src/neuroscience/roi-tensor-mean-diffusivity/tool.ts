import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly eigenvalues: readonly (readonly number[])[];
  readonly voxelWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly voxelMeanDiffusivities: readonly number[];
  readonly weightedMeanDiffusivity: number;
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
    voxelMeanDiffusivities = input.eigenvalues.map((v) => {
      if (v.length !== 3 || v.some((x) => x < 0))
        simpleError(
          "eigenvalues",
          "Three nonnegative eigenvalues per voxel required.",
        );
      return mean(v);
    });
  return {
    voxelMeanDiffusivities,
    weightedMeanDiffusivity:
      voxelMeanDiffusivities.reduce(
        (s, v, i) => s + v * input.voxelWeights[i],
        0,
      ) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eigenvalues: [
    [1, 2, 3],
    [3, 3, 3],
  ],
  voxelWeights: [1, 1],
} satisfies Input;
export const exampleOutput = {
  voxelMeanDiffusivities: [2, 3],
  weightedMeanDiffusivity: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/roi-tensor-mean-diffusivity",
  title: "Average Mean Diffusivity",
  description:
    "Derive mean diffusivity from each diffusion tensor eigenvalue triplet and aggregate supplied ROI weights; eigenvalues share one caller-selected diffusivity unit.",
  inputs: inputFields,
  outputs: [
    {
      id: "voxelMeanDiffusivities",
      label: "Voxel mean diffusivities",
      kind: "numberList",
    },
    {
      id: "weightedMeanDiffusivity",
      label: "Weighted mean diffusivity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eigenvalues: value.eigenvalues as readonly (readonly number[])[],
      voxelWeights: value.voxelWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
