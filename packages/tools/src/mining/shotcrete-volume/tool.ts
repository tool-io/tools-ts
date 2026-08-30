import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly surfaceAreasM2: readonly number[];
  readonly thicknessesMm: readonly number[];
  readonly reboundLossFraction: number;
  readonly overbreakExtraVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly inPlaceVolumeM3: number;
  readonly requiredBatchVolumeM3: number;
}>;
const inputFields = [
  { id: "surfaceAreasM2", label: "Surface areas m2", kind: "numberList" },
  { id: "thicknessesMm", label: "Thicknesses mm", kind: "numberList" },
  { id: "reboundLossFraction", label: "Rebound loss fraction", kind: "number" },
  {
    id: "overbreakExtraVolumeM3",
    label: "Overbreak extra volume m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.surfaceAreasM2.forEach((v) => nonnegative(v, "surfaceAreasM2"));
  input.thicknessesMm.forEach((v) => nonnegative(v, "thicknessesMm"));
  nonnegative(input.overbreakExtraVolumeM3, "overbreakExtraVolumeM3");
  fraction(input.reboundLossFraction, "reboundLossFraction");
  aligned(input.surfaceAreasM2, input.thicknessesMm, "surfaceAreasM2");
  if (input.reboundLossFraction === 1)
    simpleError("reboundLossFraction", "Rebound below one required.");
  const inPlaceVolumeM3 =
    input.surfaceAreasM2.reduce(
      (s, v, i) => s + (v * input.thicknessesMm[i]) / 1000,
      0,
    ) + input.overbreakExtraVolumeM3;
  return {
    inPlaceVolumeM3,
    requiredBatchVolumeM3: inPlaceVolumeM3 / (1 - input.reboundLossFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surfaceAreasM2: [100, 50],
  thicknessesMm: [100, 200],
  reboundLossFraction: 0.2,
  overbreakExtraVolumeM3: 2,
} satisfies Input;
export const exampleOutput = {
  inPlaceVolumeM3: 22,
  requiredBatchVolumeM3: 27.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/shotcrete-volume",
  title: "Shotcrete Volume",
  description:
    "Estimate placed and batch volumes with rebound as a fraction of delivered batch; support adequacy is external.",
  inputs: inputFields,
  outputs: [
    { id: "inPlaceVolumeM3", label: "In place volume m3", kind: "number" },
    {
      id: "requiredBatchVolumeM3",
      label: "Required batch volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      surfaceAreasM2: value.surfaceAreasM2 as readonly number[],
      thicknessesMm: value.thicknessesMm as readonly number[],
      reboundLossFraction: value.reboundLossFraction as number,
      overbreakExtraVolumeM3: value.overbreakExtraVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
