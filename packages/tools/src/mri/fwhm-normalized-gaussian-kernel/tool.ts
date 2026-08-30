import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly fwhmMm: number;
  readonly voxelSpacingMm: number;
  readonly radiusVoxels: number;
}>;
export type Output = Readonly<{
  readonly offsetsVoxels: readonly number[];
  readonly normalizedWeights: readonly number[];
  readonly sigmaVoxels: number;
}>;
const inputFields = [
  { id: "fwhmMm", label: "Fwhm mm", kind: "number", unit: "mm" },
  {
    id: "voxelSpacingMm",
    label: "Voxel spacing mm",
    kind: "number",
    unit: "mm",
  },
  { id: "radiusVoxels", label: "Radius voxels", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fwhmMm, "fwhmMm");
  positive(input.voxelSpacingMm, "voxelSpacingMm");
  count(input.radiusVoxels, "radiusVoxels");
  if (input.radiusVoxels > 49999)
    simpleError("radiusVoxels", "Kernel exceeds generated-value budget.");
  const sigmaVoxels =
      input.fwhmMm / (2 * Math.sqrt(2 * Math.LN2) * input.voxelSpacingMm),
    offsetsVoxels = Array.from(
      { length: 2 * input.radiusVoxels + 1 },
      (_, i) => i - input.radiusVoxels,
    ),
    weights = offsetsVoxels.map((v) => Math.exp(-0.5 * (v / sigmaVoxels) ** 2)),
    sum = weights.reduce((a, b) => a + b, 0);
  return {
    offsetsVoxels,
    normalizedWeights: weights.map((v) => v / sum),
    sigmaVoxels,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fwhmMm: 2.3548200450309493,
  voxelSpacingMm: 1,
  radiusVoxels: 1,
} satisfies Input;
export const exampleOutput = {
  offsetsVoxels: [-1, 0, 1],
  normalizedWeights: [
    0.274068619061197, 0.45186276187760605, 0.274068619061197,
  ],
  sigmaVoxels: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/fwhm-normalized-gaussian-kernel",
  title: "Spatial Smoothing FWHM",
  description:
    "Build a normalized truncated 1D Gaussian kernel from physical FWHM and voxel spacing; distinct from estimating residual smoothness from derivative covariance.",
  inputs: inputFields,
  outputs: [
    { id: "offsetsVoxels", label: "Offsets voxels", kind: "numberList" },
    {
      id: "normalizedWeights",
      label: "Normalized weights",
      kind: "numberList",
    },
    { id: "sigmaVoxels", label: "Sigma voxels", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      fwhmMm: value.fwhmMm as number,
      voxelSpacingMm: value.voxelSpacingMm as number,
      radiusVoxels: value.radiusVoxels as number,
    }),
});
export const run = tool.execute;
export default tool;
