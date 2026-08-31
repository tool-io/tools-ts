import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly planktonSettledVolumeMl: number;
  readonly blankSettledVolumeMl: number;
  readonly originalWaterSampleLiters: number;
}>;
export type Output = Readonly<{
  readonly signedBlankCorrectedSettledVolumeMl: number;
  readonly observedSettledPlanktonMlPerLiter: number;
}>;
const inputFields = [
  {
    id: "planktonSettledVolumeMl",
    label: "Plankton settled volume ml",
    kind: "number",
  },
  {
    id: "blankSettledVolumeMl",
    label: "Blank settled volume ml",
    kind: "number",
  },
  {
    id: "originalWaterSampleLiters",
    label: "Original water sample liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.originalWaterSampleLiters, "originalWaterSampleLiters");
  nonnegative(input.planktonSettledVolumeMl, "planktonSettledVolumeMl");
  nonnegative(input.blankSettledVolumeMl, "blankSettledVolumeMl");
  const net = input.planktonSettledVolumeMl - input.blankSettledVolumeMl;
  return {
    signedBlankCorrectedSettledVolumeMl: net,
    observedSettledPlanktonMlPerLiter: net / input.originalWaterSampleLiters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  planktonSettledVolumeMl: 2,
  blankSettledVolumeMl: 0.5,
  originalWaterSampleLiters: 3,
} satisfies Input;
export const exampleOutput = {
  signedBlankCorrectedSettledVolumeMl: 1.5,
  observedSettledPlanktonMlPerLiter: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/plankton-settling-volume-liter",
  title: "Plankton Settling Volume Liter Calculator",
  description:
    "Normalize actual blank-corrected plankton settled volume to original water sample; negative blank estimates retained as nondetection evidence, not biomass or counted-cell density.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBlankCorrectedSettledVolumeMl",
      label: "Signed blank corrected settled volume ml",
      kind: "number",
    },
    {
      id: "observedSettledPlanktonMlPerLiter",
      label: "Observed settled plankton ml per liter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      planktonSettledVolumeMl: value.planktonSettledVolumeMl as number,
      blankSettledVolumeMl: value.blankSettledVolumeMl as number,
      originalWaterSampleLiters: value.originalWaterSampleLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
