import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly profilePositionsMicrometers: readonly number[];
  readonly dnaFluorescence: readonly number[];
  readonly tailStartMicrometers: number;
}>;
export type Output = Readonly<{
  readonly tailDnaFraction: number;
  readonly headCentroidMicrometers: number;
  readonly tailCentroidMicrometers: number;
  readonly tailMomentMicrometers: number;
  readonly oliveTailMomentMicrometers: number;
}>;
const inputFields = [
  {
    id: "profilePositionsMicrometers",
    label: "Profile positions micrometers",
    kind: "numberList",
  },
  { id: "dnaFluorescence", label: "Dna fluorescence", kind: "numberList" },
  {
    id: "tailStartMicrometers",
    label: "Tail start micrometers",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.profilePositionsMicrometers, "profilePositionsMicrometers");
  aligned(
    input.profilePositionsMicrometers,
    input.dnaFluorescence,
    "profilePositionsMicrometers",
  );
  input.dnaFluorescence.forEach((v) => nonnegative(v, "dnaFluorescence"));
  let headMass = 0,
    tailMass = 0,
    headSum = 0,
    tailSum = 0,
    lastTail = input.tailStartMicrometers;
  input.dnaFluorescence.forEach((v, i) => {
    const x = input.profilePositionsMicrometers[i];
    if (x < input.tailStartMicrometers) {
      headMass += v;
      headSum += v * x;
    } else {
      tailMass += v;
      tailSum += v * x;
      if (v > 0) lastTail = x;
    }
  });
  positive(headMass, "tailStartMicrometers");
  const tailDnaFraction = tailMass / (headMass + tailMass),
    headCentroidMicrometers = headSum / headMass,
    tailCentroidMicrometers = tailMass
      ? tailSum / tailMass
      : input.tailStartMicrometers;
  return {
    tailDnaFraction,
    headCentroidMicrometers,
    tailCentroidMicrometers,
    tailMomentMicrometers:
      tailDnaFraction * (lastTail - input.tailStartMicrometers),
    oliveTailMomentMicrometers:
      tailDnaFraction * (tailCentroidMicrometers - headCentroidMicrometers),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  profilePositionsMicrometers: [0, 1, 2, 3],
  dnaFluorescence: [3, 1, 1, 1],
  tailStartMicrometers: 2,
} satisfies Input;
export const exampleOutput = {
  tailDnaFraction: 0.3333333333333333,
  headCentroidMicrometers: 0.25,
  tailCentroidMicrometers: 2.5,
  tailMomentMicrometers: 0.3333333333333333,
  oliveTailMomentMicrometers: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/fluorescence-profile-comet-tail-moments",
  title: "Comet Assay Tail Moment",
  description:
    "Derive DNA fraction and classic/Olive comet moments from a supplied uniformly area-weighted fluorescence profile and head/tail boundary; segmentation, background correction and genotoxicity interpretation are external.",
  inputs: inputFields,
  outputs: [
    { id: "tailDnaFraction", label: "Tail dna fraction", kind: "number" },
    {
      id: "headCentroidMicrometers",
      label: "Head centroid micrometers",
      kind: "number",
    },
    {
      id: "tailCentroidMicrometers",
      label: "Tail centroid micrometers",
      kind: "number",
    },
    {
      id: "tailMomentMicrometers",
      label: "Tail moment micrometers",
      kind: "number",
    },
    {
      id: "oliveTailMomentMicrometers",
      label: "Olive tail moment micrometers",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      profilePositionsMicrometers:
        value.profilePositionsMicrometers as readonly number[],
      dnaFluorescence: value.dnaFluorescence as readonly number[],
      tailStartMicrometers: value.tailStartMicrometers as number,
    }),
});
export const run = tool.execute;
export default tool;
