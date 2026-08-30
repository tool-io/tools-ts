import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cellProfile: readonly number[];
  readonly simulatedDoubletProfile: readonly number[];
  readonly nearestSingletProfile: readonly number[];
  readonly suspicionThreshold: number;
}>;
export type Output = Readonly<{
  readonly doubletDistance: number;
  readonly singletDistance: number;
  readonly suspicionMargin: number;
  readonly suspected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const n = input.cellProfile.length;
  if (
    n === 0 ||
    input.simulatedDoubletProfile.length !== n ||
    input.nearestSingletProfile.length !== n
  )
    simpleError(
      "cellProfile",
      "Aligned cell and reference profiles are required.",
    );
  const distance = (ref: readonly number[]) =>
      Math.sqrt(
        ref.reduce((s, v, i) => s + (v - input.cellProfile[i]) ** 2, 0),
      ),
    doubletDistance = distance(input.simulatedDoubletProfile),
    singletDistance = distance(input.nearestSingletProfile),
    suspicionMargin = singletDistance - doubletDistance;
  return {
    doubletDistance,
    singletDistance,
    suspicionMargin,
    suspected: suspicionMargin >= input.suspicionThreshold,
  };
};

export const exampleInput = {
  cellProfile: [5, 5],
  simulatedDoubletProfile: [6, 4],
  nearestSingletProfile: [1, 1],
  suspicionThreshold: 0,
} satisfies Input;
export const exampleOutput = {
  doubletDistance: 1.4142135623730951,
  singletDistance: 5.656854249492381,
  suspicionMargin: 4.242640687119286,
  suspected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/doublet-suspicion-score",
  title: "Doublet Suspicion Score",
  description:
    "Compare a cell’s expression profile with simulated doublet and singlet neighbors.",
  inputs: [
    { id: "cellProfile", kind: "numberList", label: "Cell profile" },
    {
      id: "simulatedDoubletProfile",
      kind: "numberList",
      label: "Simulated doublet profile",
    },
    {
      id: "nearestSingletProfile",
      kind: "numberList",
      label: "Nearest singlet profile",
    },
    { id: "suspicionThreshold", kind: "number", label: "Suspicion threshold" },
  ],
  outputs: [
    { id: "doubletDistance", kind: "number", label: "Doublet distance" },
    { id: "singletDistance", kind: "number", label: "Singlet distance" },
    { id: "suspicionMargin", kind: "number", label: "Suspicion margin" },
    { id: "suspected", kind: "boolean", label: "Suspected" },
  ],
  calculate: (value) =>
    calculate({
      cellProfile: value.cellProfile as readonly number[],
      simulatedDoubletProfile:
        value.simulatedDoubletProfile as readonly number[],
      nearestSingletProfile: value.nearestSingletProfile as readonly number[],
      suspicionThreshold: value.suspicionThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
