import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  strictlyIncreasing,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMulberryPruningDayOffsets: readonly number[];
  readonly callerMatchedMinimumPruningIntervalDays: number;
}>;
export type Output = Readonly<{
  readonly observedPruningIntervalsDays: readonly number[];
  readonly callerShortIntervalIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMulberryPruningDayOffsets",
    label: "Observed mulberry pruning day offsets",
    kind: "numberList",
  },
  {
    id: "callerMatchedMinimumPruningIntervalDays",
    label: "Caller matched minimum pruning interval days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMatchedMinimumPruningIntervalDays,
    "callerMatchedMinimumPruningIntervalDays",
  );
  strictlyIncreasing(input.observedMulberryPruningDayOffsets, "pruning dates");
  const d = input.observedMulberryPruningDayOffsets
    .slice(1)
    .map((v, i) => v - input.observedMulberryPruningDayOffsets[i]);
  return {
    observedPruningIntervalsDays: d,
    callerShortIntervalIndices: d.flatMap((v, i) =>
      v < input.callerMatchedMinimumPruningIntervalDays ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMulberryPruningDayOffsets: [0, 20, 45],
  callerMatchedMinimumPruningIntervalDays: 22,
} satisfies Input;
export const exampleOutput = {
  observedPruningIntervalsDays: [20, 25],
  callerShortIntervalIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/pruning-cycle-days-mulberry",
  title: "Pruning Cycle Days Mulberry Calculator",
  description:
    "Actual mulberry pruning date intervals vs caller independently matched practice minimum, not invented growth stage or pruning recommendation. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPruningIntervalsDays",
      label: "Observed pruning intervals days",
      kind: "numberList",
    },
    {
      id: "callerShortIntervalIndices",
      label: "Caller short interval indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMulberryPruningDayOffsets:
        value.observedMulberryPruningDayOffsets as readonly number[],
      callerMatchedMinimumPruningIntervalDays:
        value.callerMatchedMinimumPruningIntervalDays as number,
    }),
});
export const run = tool.execute;
export default tool;
