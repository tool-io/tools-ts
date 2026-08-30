import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly lesionFractions: readonly number[];
  readonly voxelDimensionsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly effectiveVoxelCount: number;
  readonly lesionVolumeMm3: number;
  readonly lesionVolumeMl: number;
}>;
const inputFields = [
  { id: "lesionFractions", label: "Lesion fractions", kind: "numberList" },
  { id: "voxelDimensionsMm", label: "Voxel dimensions mm", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.lesionFractions.length || input.voxelDimensionsMm.length !== 3)
    simpleError(
      "lesionFractions",
      "Nonempty lesion fractions and three voxel dimensions required.",
    );
  input.lesionFractions.forEach((v) => fraction(v, "lesionFractions"));
  input.voxelDimensionsMm.forEach((v) => positive(v, "voxelDimensionsMm"));
  const effectiveVoxelCount = input.lesionFractions.reduce((a, b) => a + b, 0),
    lesionVolumeMm3 =
      effectiveVoxelCount * input.voxelDimensionsMm.reduce((a, b) => a * b, 1);
  return {
    effectiveVoxelCount,
    lesionVolumeMm3,
    lesionVolumeMl: lesionVolumeMm3 / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lesionFractions: [0, 0.5, 1],
  voxelDimensionsMm: [2, 2, 3],
} satisfies Input;
export const exampleOutput = {
  effectiveVoxelCount: 1.5,
  lesionVolumeMm3: 18,
  lesionVolumeMl: 0.018,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/partial-volume-lesion-volume",
  title: "Lesion Volume",
  description:
    "Integrate lesion voxel fractions using anisotropic voxel dimensions; segmentation and partial-volume probabilities must be supplied.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveVoxelCount",
      label: "Effective voxel count",
      kind: "number",
    },
    { id: "lesionVolumeMm3", label: "Lesion volume mm3", kind: "number" },
    { id: "lesionVolumeMl", label: "Lesion volume ml", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      lesionFractions: value.lesionFractions as readonly number[],
      voxelDimensionsMm: value.voxelDimensionsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
