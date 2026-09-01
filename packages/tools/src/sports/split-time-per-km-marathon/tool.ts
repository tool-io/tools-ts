import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  finite,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly plannedKmSegmentDistances: readonly number[];
  readonly plannedSegmentSecondsKm: readonly number[];
}>;
export type Output = Readonly<{
  readonly plannedSegmentTimesSeconds: readonly number[];
  readonly plannedCumulativeSplitSeconds: readonly number[];
}>;
const inputFields = [
  {
    id: "plannedKmSegmentDistances",
    label: "Planned km segment distances",
    kind: "numberList",
  },
  {
    id: "plannedSegmentSecondsKm",
    label: "Planned segment seconds km",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.plannedKmSegmentDistances.forEach((v) =>
    positive(v, "plannedKmSegmentDistances"),
  );
  input.plannedSegmentSecondsKm.forEach((v) =>
    positive(v, "plannedSegmentSecondsKm"),
  );
  aligned(
    input.plannedKmSegmentDistances,
    input.plannedSegmentSecondsKm,
    "plannedKmSegmentDistances",
  );
  const times = input.plannedKmSegmentDistances.map(
    (v, i) => v * input.plannedSegmentSecondsKm[i],
  );
  let total = 0;
  return {
    plannedSegmentTimesSeconds: times,
    plannedCumulativeSplitSeconds: times.map(
      (v) => (total = finite(total + v)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plannedKmSegmentDistances: [1, 1, 0.195],
  plannedSegmentSecondsKm: [300, 310, 320],
} satisfies Input;
export const exampleOutput = {
  plannedSegmentTimesSeconds: [300, 310, 62.4],
  plannedCumulativeSplitSeconds: [300, 610, 672.4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/split-time-per-km-marathon",
  title: "Per-KM Marathon Split Calculator",
  description:
    "Build actual caller variable-pace segment split schedule including partial final kilometers; not scalar mean pace conversion or assumed even marathon pacing.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedSegmentTimesSeconds",
      label: "Planned segment times seconds",
      kind: "numberList",
    },
    {
      id: "plannedCumulativeSplitSeconds",
      label: "Planned cumulative split seconds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      plannedKmSegmentDistances:
        value.plannedKmSegmentDistances as readonly number[],
      plannedSegmentSecondsKm:
        value.plannedSegmentSecondsKm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
