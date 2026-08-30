import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly craterLakeVolumeM3: number;
  readonly releasedWaterFraction: number;
  readonly initialWaterLossFraction: number;
  readonly entrainedDrySedimentMassKg: number;
  readonly grainDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly remainingWaterVolumeM3: number;
  readonly entrainedSolidVolumeM3: number;
  readonly initialMixtureVolumeM3: number;
  readonly solidVolumeFraction: number;
}>;
const inputFields = [
  { id: "craterLakeVolumeM3", label: "Crater lake volume m3", kind: "number" },
  {
    id: "releasedWaterFraction",
    label: "Released water fraction",
    kind: "number",
  },
  {
    id: "initialWaterLossFraction",
    label: "Initial water loss fraction",
    kind: "number",
  },
  {
    id: "entrainedDrySedimentMassKg",
    label: "Entrained dry sediment mass kg",
    kind: "number",
  },
  {
    id: "grainDensityKgPerM3",
    label: "Grain density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.grainDensityKgPerM3, "grainDensityKgPerM3");
  nonnegative(input.craterLakeVolumeM3, "craterLakeVolumeM3");
  nonnegative(input.entrainedDrySedimentMassKg, "entrainedDrySedimentMassKg");
  fraction(input.releasedWaterFraction, "releasedWaterFraction");
  fraction(input.initialWaterLossFraction, "initialWaterLossFraction");
  const remainingWaterVolumeM3 =
      input.craterLakeVolumeM3 *
      input.releasedWaterFraction *
      (1 - input.initialWaterLossFraction),
    entrainedSolidVolumeM3 =
      input.entrainedDrySedimentMassKg / input.grainDensityKgPerM3,
    initialMixtureVolumeM3 = positive(
      remainingWaterVolumeM3 + entrainedSolidVolumeM3,
      "mixture",
    );
  return {
    remainingWaterVolumeM3,
    entrainedSolidVolumeM3,
    initialMixtureVolumeM3,
    solidVolumeFraction: entrainedSolidVolumeM3 / initialMixtureVolumeM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  craterLakeVolumeM3: 100,
  releasedWaterFraction: 0.5,
  initialWaterLossFraction: 0.2,
  entrainedDrySedimentMassKg: 10000,
  grainDensityKgPerM3: 2000,
} satisfies Input;
export const exampleOutput = {
  remainingWaterVolumeM3: 40,
  entrainedSolidVolumeM3: 5,
  initialMixtureVolumeM3: 45,
  solidVolumeFraction: 0.1111111111111111,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lahar-volume-crater-lake-breach",
  title: "Lahar Volume Crater Lake Breach",
  description:
    "Balance released crater-lake water, initial water loss and dry sediment grains into initial lahar volume; pores are not double counted and downstream entrainment/inundation are not predicted.",
  inputs: inputFields,
  outputs: [
    {
      id: "remainingWaterVolumeM3",
      label: "Remaining water volume m3",
      kind: "number",
    },
    {
      id: "entrainedSolidVolumeM3",
      label: "Entrained solid volume m3",
      kind: "number",
    },
    {
      id: "initialMixtureVolumeM3",
      label: "Initial mixture volume m3",
      kind: "number",
    },
    {
      id: "solidVolumeFraction",
      label: "Solid volume fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      craterLakeVolumeM3: value.craterLakeVolumeM3 as number,
      releasedWaterFraction: value.releasedWaterFraction as number,
      initialWaterLossFraction: value.initialWaterLossFraction as number,
      entrainedDrySedimentMassKg: value.entrainedDrySedimentMassKg as number,
      grainDensityKgPerM3: value.grainDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
