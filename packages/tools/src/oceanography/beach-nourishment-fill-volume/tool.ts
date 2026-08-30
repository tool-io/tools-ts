import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly crossShoreStationsM: readonly number[];
  readonly existingElevationsM: readonly number[];
  readonly targetElevationsM: readonly number[];
  readonly alongshoreLengthM: number;
  readonly placedToRetainedVolumeFraction: number;
}>;
export type Output = Readonly<{
  readonly retainedFillVolumeM3: number;
  readonly requiredPlacedFillVolumeM3: number;
}>;
const inputFields = [
  {
    id: "crossShoreStationsM",
    label: "Cross shore stations m",
    kind: "numberList",
  },
  {
    id: "existingElevationsM",
    label: "Existing elevations m",
    kind: "numberList",
  },
  { id: "targetElevationsM", label: "Target elevations m", kind: "numberList" },
  { id: "alongshoreLengthM", label: "Alongshore length m", kind: "number" },
  {
    id: "placedToRetainedVolumeFraction",
    label: "Placed to retained volume fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.alongshoreLengthM, "alongshoreLengthM");
  positive(
    input.placedToRetainedVolumeFraction,
    "placedToRetainedVolumeFraction",
  );
  fraction(
    input.placedToRetainedVolumeFraction,
    "placedToRetainedVolumeFraction",
  );
  aligned(
    input.crossShoreStationsM,
    input.existingElevationsM,
    "crossShoreStationsM",
  );
  aligned(
    input.crossShoreStationsM,
    input.targetElevationsM,
    "crossShoreStationsM",
  );
  const diff = input.targetElevationsM.map((v, i) =>
      nonnegative(v - input.existingElevationsM[i], "targetElevationsM"),
    ),
    retainedFillVolumeM3 =
      integral(input.crossShoreStationsM, diff) * input.alongshoreLengthM;
  return {
    retainedFillVolumeM3,
    requiredPlacedFillVolumeM3:
      retainedFillVolumeM3 / input.placedToRetainedVolumeFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crossShoreStationsM: [0, 10, 20],
  existingElevationsM: [0, 1, 0],
  targetElevationsM: [1, 2, 1],
  alongshoreLengthM: 100,
  placedToRetainedVolumeFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  retainedFillVolumeM3: 2000,
  requiredPlacedFillVolumeM3: 2500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/beach-nourishment-fill-volume",
  title: "Beach Nourishment Fill Volume",
  description:
    "Integrate measured target-minus-existing profile fill on supplied stations and length, then account for retention; target cuts error rather than silently crediting cut volume as nourishment.",
  inputs: inputFields,
  outputs: [
    {
      id: "retainedFillVolumeM3",
      label: "Retained fill volume m3",
      kind: "number",
    },
    {
      id: "requiredPlacedFillVolumeM3",
      label: "Required placed fill volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crossShoreStationsM: value.crossShoreStationsM as readonly number[],
      existingElevationsM: value.existingElevationsM as readonly number[],
      targetElevationsM: value.targetElevationsM as readonly number[],
      alongshoreLengthM: value.alongshoreLengthM as number,
      placedToRetainedVolumeFraction:
        value.placedToRetainedVolumeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
