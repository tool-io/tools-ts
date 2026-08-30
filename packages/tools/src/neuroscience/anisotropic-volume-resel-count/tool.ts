import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly maskFractions: readonly number[];
  readonly voxelDimensionsMm: readonly number[];
  readonly smoothnessFwhmMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly maskVolumeMm3: number;
  readonly volumeReselCount: number;
}>;
const inputFields = [
  { id: "maskFractions", label: "Mask fractions", kind: "numberList" },
  { id: "voxelDimensionsMm", label: "Voxel dimensions mm", kind: "numberList" },
  { id: "smoothnessFwhmMm", label: "Smoothness fwhm mm", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.maskFractions.length ||
    input.voxelDimensionsMm.length !== 3 ||
    input.smoothnessFwhmMm.length !== 3
  )
    simpleError(
      "maskFractions",
      "Nonempty mask fractions and three-component voxel/FWHM dimensions required.",
    );
  input.maskFractions.forEach((v) => fraction(v, "maskFractions"));
  input.voxelDimensionsMm.forEach((v) => positive(v, "voxelDimensionsMm"));
  input.smoothnessFwhmMm.forEach((v) => positive(v, "smoothnessFwhmMm"));
  const maskVolumeMm3 =
    input.maskFractions.reduce((a, b) => a + b, 0) *
    input.voxelDimensionsMm.reduce((a, b) => a * b, 1);
  return {
    maskVolumeMm3,
    volumeReselCount:
      maskVolumeMm3 / input.smoothnessFwhmMm.reduce((a, b) => a * b, 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  maskFractions: [1, 0.5, 1],
  voxelDimensionsMm: [2, 2, 2],
  smoothnessFwhmMm: [2, 4, 5],
} satisfies Input;
export const exampleOutput = {
  maskVolumeMm3: 20,
  volumeReselCount: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/anisotropic-volume-resel-count",
  title: "Resel Count",
  description:
    "Estimate the volume resel term R3 from a fractional search mask and axis-aligned anisotropic FWHM; boundary and lower-dimensional resel terms are not included.",
  inputs: inputFields,
  outputs: [
    { id: "maskVolumeMm3", label: "Mask volume mm3", kind: "number" },
    { id: "volumeReselCount", label: "Volume resel count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      maskFractions: value.maskFractions as readonly number[],
      voxelDimensionsMm: value.voxelDimensionsMm as readonly number[],
      smoothnessFwhmMm: value.smoothnessFwhmMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
