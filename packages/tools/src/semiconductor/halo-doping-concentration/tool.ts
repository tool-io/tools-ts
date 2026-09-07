import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedHaloVoxelVolumesM3: readonly number[];
  readonly observedHaloDopantCounts: readonly number[];
  readonly callerHaloVoxelEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownHaloVolumeWeightedConcentrationPerM3: number;
  readonly unknownHaloVoxelCount: number;
}>;
const inputFields = [
  {
    id: "observedHaloVoxelVolumesM3",
    label: "Observed halo voxel volumes m3",
    kind: "numberList",
  },
  {
    id: "observedHaloDopantCounts",
    label: "Observed halo dopant counts",
    kind: "numberList",
  },
  {
    id: "callerHaloVoxelEvidenceFlags",
    label: "Caller halo voxel evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedHaloVoxelVolumesM3.forEach((v) =>
    positive(v, "observedHaloVoxelVolumesM3"),
  );
  input.observedHaloDopantCounts.forEach((v) =>
    nonnegative(v, "observedHaloDopantCounts"),
  );
  binary(input.callerHaloVoxelEvidenceFlags, "callerHaloVoxelEvidenceFlags");
  aligned(
    input.observedHaloVoxelVolumesM3,
    input.observedHaloDopantCounts,
    "observedHaloVoxelVolumesM3",
  );
  aligned(
    input.observedHaloVoxelVolumesM3,
    input.callerHaloVoxelEvidenceFlags,
    "observedHaloVoxelVolumesM3",
  );
  const volume = sum(
    input.observedHaloVoxelVolumesM3.filter(
      (_, i) => input.callerHaloVoxelEvidenceFlags[i],
    ),
  );
  positive(volume, "knownHaloVolume");
  return {
    knownHaloVolumeWeightedConcentrationPerM3:
      sum(
        input.observedHaloDopantCounts.filter(
          (_, i) => input.callerHaloVoxelEvidenceFlags[i],
        ),
      ) / volume,
    unknownHaloVoxelCount: input.callerHaloVoxelEvidenceFlags.filter((v) => !v)
      .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHaloVoxelVolumesM3: [1, 2],
  observedHaloDopantCounts: [100, 100],
  callerHaloVoxelEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownHaloVolumeWeightedConcentrationPerM3: 100,
  unknownHaloVoxelCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/halo-doping-concentration",
  title: "Semiconductor Halo Doping Concentration Calculator",
  description:
    "Pool actual halo-dopant voxel count/volume evidence with explicit unavailable measurements, not supplied nominal dose or equal-voxel average, no implant/process recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownHaloVolumeWeightedConcentrationPerM3",
      label: "Known halo volume weighted concentration per m3",
      kind: "number",
    },
    {
      id: "unknownHaloVoxelCount",
      label: "Unknown halo voxel count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHaloVoxelVolumesM3:
        value.observedHaloVoxelVolumesM3 as readonly number[],
      observedHaloDopantCounts:
        value.observedHaloDopantCounts as readonly number[],
      callerHaloVoxelEvidenceFlags:
        value.callerHaloVoxelEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
