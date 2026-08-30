import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly scratchCounts: readonly number[];
  readonly pitCounts: readonly number[];
  readonly examinedAreasMm2: readonly number[];
  readonly callerScratchPitRatioBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly scratchDensitiesPerMm2: readonly number[];
  readonly pitDensitiesPerMm2: readonly number[];
  readonly scratchPitRatios: readonly number[];
  readonly withinCallerMicrowearRatioBandFlags: readonly number[];
}>;
const inputFields = [
  { id: "scratchCounts", label: "Scratch counts", kind: "numberList" },
  { id: "pitCounts", label: "Pit counts", kind: "numberList" },
  { id: "examinedAreasMm2", label: "Examined areas mm2", kind: "numberList" },
  {
    id: "callerScratchPitRatioBounds",
    label: "Caller scratch pit ratio bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pitCounts.forEach((v) => positive(v, "pitCounts"));
  input.examinedAreasMm2.forEach((v) => positive(v, "examinedAreasMm2"));
  input.callerScratchPitRatioBounds.forEach((v) =>
    nonnegative(v, "callerScratchPitRatioBounds"),
  );
  input.scratchCounts.forEach((v) => count(v, "scratchCounts"));
  input.pitCounts.forEach((v) => count(v, "pitCounts"));
  aligned(input.scratchCounts, input.pitCounts, "scratchCounts");
  aligned(input.scratchCounts, input.examinedAreasMm2, "scratchCounts");
  if (
    input.callerScratchPitRatioBounds.length !== 2 ||
    input.callerScratchPitRatioBounds[0] > input.callerScratchPitRatioBounds[1]
  )
    simpleError("bounds", "Ordered two-value caller ratio band required.");
  const scratchPitRatios = input.scratchCounts.map(
    (v, i) => v / input.pitCounts[i],
  );
  return {
    scratchDensitiesPerMm2: input.scratchCounts.map(
      (v, i) => v / input.examinedAreasMm2[i],
    ),
    pitDensitiesPerMm2: input.pitCounts.map(
      (v, i) => v / input.examinedAreasMm2[i],
    ),
    scratchPitRatios,
    withinCallerMicrowearRatioBandFlags: scratchPitRatios.map((v) =>
      v >= input.callerScratchPitRatioBounds[0] &&
      v <= input.callerScratchPitRatioBounds[1]
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  scratchCounts: [10, 20],
  pitCounts: [5, 5],
  examinedAreasMm2: [1, 2],
  callerScratchPitRatioBounds: [1, 3],
} satisfies Input;
export const exampleOutput = {
  scratchDensitiesPerMm2: [10, 10],
  pitDensitiesPerMm2: [5, 2.5],
  scratchPitRatios: [2, 4],
  withinCallerMicrowearRatioBandFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/microwear-scratch-pit-ratio",
  title: "Microwear Scratch-Pit Density Ratio Classifier",
  description:
    "Measure surface-standardized scratch/pit densities and caller ratio band, requiring positive pit denominators; proxy class does not identify foods, habitual diet or ancestry.",
  inputs: inputFields,
  outputs: [
    {
      id: "scratchDensitiesPerMm2",
      label: "Scratch densities per mm2",
      kind: "numberList",
    },
    {
      id: "pitDensitiesPerMm2",
      label: "Pit densities per mm2",
      kind: "numberList",
    },
    { id: "scratchPitRatios", label: "Scratch pit ratios", kind: "numberList" },
    {
      id: "withinCallerMicrowearRatioBandFlags",
      label: "Within caller microwear ratio band flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      scratchCounts: value.scratchCounts as readonly number[],
      pitCounts: value.pitCounts as readonly number[],
      examinedAreasMm2: value.examinedAreasMm2 as readonly number[],
      callerScratchPitRatioBounds:
        value.callerScratchPitRatioBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
