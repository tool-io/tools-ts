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
  readonly callerExpectedStrokesBeforeTeeShots: readonly number[];
  readonly callerExpectedStrokesAtObservedLeave: readonly number[];
  readonly observedShotAndPenaltyStrokes: readonly number[];
}>;
export type Output = Readonly<{
  readonly strokesGainedByTeeShot: readonly number[];
  readonly totalObservedTeeStrokesGained: number;
}>;
const inputFields = [
  {
    id: "callerExpectedStrokesBeforeTeeShots",
    label: "Caller expected strokes before tee shots",
    kind: "numberList",
  },
  {
    id: "callerExpectedStrokesAtObservedLeave",
    label: "Caller expected strokes at observed leave",
    kind: "numberList",
  },
  {
    id: "observedShotAndPenaltyStrokes",
    label: "Observed shot and penalty strokes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerExpectedStrokesBeforeTeeShots.forEach((v) =>
    nonnegative(v, "callerExpectedStrokesBeforeTeeShots"),
  );
  input.callerExpectedStrokesAtObservedLeave.forEach((v) =>
    nonnegative(v, "callerExpectedStrokesAtObservedLeave"),
  );
  aligned(
    input.callerExpectedStrokesBeforeTeeShots,
    input.callerExpectedStrokesAtObservedLeave,
    "callerExpectedStrokesBeforeTeeShots",
  );
  aligned(
    input.callerExpectedStrokesBeforeTeeShots,
    input.observedShotAndPenaltyStrokes,
    "callerExpectedStrokesBeforeTeeShots",
  );
  input.observedShotAndPenaltyStrokes.forEach((v) =>
    bounded(v, "strokes", 1, 20),
  );
  const gains = input.callerExpectedStrokesBeforeTeeShots.map(
    (v, i) =>
      v -
      input.observedShotAndPenaltyStrokes[i] -
      input.callerExpectedStrokesAtObservedLeave[i],
  );
  return {
    strokesGainedByTeeShot: gains,
    totalObservedTeeStrokesGained: sum(gains),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerExpectedStrokesBeforeTeeShots: [4, 5],
  callerExpectedStrokesAtObservedLeave: [2.8, 4.2],
  observedShotAndPenaltyStrokes: [1, 2],
} satisfies Input;
export const exampleOutput = {
  strokesGainedByTeeShot: [0.2, -1.2],
  totalObservedTeeStrokesGained: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/golf-strokes-gained-off-tee",
  title: "Strokes Gained Off-the-Tee Calculator",
  description:
    "Reconcile actual tee shot/penalty/leave evidence with caller expected-strokes benchmark before and after; no inferred shot-distance model or professional baseline.",
  inputs: inputFields,
  outputs: [
    {
      id: "strokesGainedByTeeShot",
      label: "Strokes gained by tee shot",
      kind: "numberList",
    },
    {
      id: "totalObservedTeeStrokesGained",
      label: "Total observed tee strokes gained",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerExpectedStrokesBeforeTeeShots:
        value.callerExpectedStrokesBeforeTeeShots as readonly number[],
      callerExpectedStrokesAtObservedLeave:
        value.callerExpectedStrokesAtObservedLeave as readonly number[],
      observedShotAndPenaltyStrokes:
        value.observedShotAndPenaltyStrokes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
