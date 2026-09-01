import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSetLoadsKg: readonly number[];
  readonly observedRepetitionCounts: readonly number[];
  readonly observedSetMultiplicity: readonly number[];
}>;
export type Output = Readonly<{
  readonly volumeLoadKgByEntry: readonly number[];
  readonly totalObservedVolumeLoadKg: number;
}>;
const inputFields = [
  {
    id: "observedSetLoadsKg",
    label: "Observed set loads kg",
    kind: "numberList",
  },
  {
    id: "observedRepetitionCounts",
    label: "Observed repetition counts",
    kind: "numberList",
  },
  {
    id: "observedSetMultiplicity",
    label: "Observed set multiplicity",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSetLoadsKg.forEach((v) => nonnegative(v, "observedSetLoadsKg"));
  aligned(
    input.observedSetLoadsKg,
    input.observedRepetitionCounts,
    "observedSetLoadsKg",
  );
  aligned(
    input.observedSetLoadsKg,
    input.observedSetMultiplicity,
    "observedSetLoadsKg",
  );
  input.observedRepetitionCounts.forEach((v) => bounded(v, "reps", 0, 1000));
  input.observedSetMultiplicity.forEach((v) => bounded(v, "sets", 0, 1000));
  const load = input.observedSetLoadsKg.map(
    (v, i) =>
      v * input.observedRepetitionCounts[i] * input.observedSetMultiplicity[i],
  );
  return { volumeLoadKgByEntry: load, totalObservedVolumeLoadKg: sum(load) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSetLoadsKg: [50, 60],
  observedRepetitionCounts: [5, 3],
  observedSetMultiplicity: [2, 1],
} satisfies Input;
export const exampleOutput = {
  volumeLoadKgByEntry: [500, 180],
  totalObservedVolumeLoadKg: 680,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/training-volume-load-tonnage",
  title: "Training Tonnage Volume Load Calculator",
  description:
    "Inventory actual set/repetition/multiplicity volume load, not 1RM regression, weekly RPE load, mechanical work or adaptation guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "volumeLoadKgByEntry",
      label: "Volume load kg by entry",
      kind: "numberList",
    },
    {
      id: "totalObservedVolumeLoadKg",
      label: "Total observed volume load kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSetLoadsKg: value.observedSetLoadsKg as readonly number[],
      observedRepetitionCounts:
        value.observedRepetitionCounts as readonly number[],
      observedSetMultiplicity:
        value.observedSetMultiplicity as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
