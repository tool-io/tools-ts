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
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerJiveChasseDurationsBeats: readonly number[];
  readonly callerChasseStartBeat: number;
  readonly observedJiveChasseStepBeats: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerJiveChasseStepBeats: readonly number[];
  readonly measuredMinusScoreChasseBeatOffsets: readonly number[];
  readonly callerChasseEndBeat: number;
}>;
const inputFields = [
  {
    id: "callerJiveChasseDurationsBeats",
    label: "Caller jive chasse durations beats",
    kind: "numberList",
  },
  {
    id: "callerChasseStartBeat",
    label: "Caller chasse start beat",
    kind: "number",
  },
  {
    id: "observedJiveChasseStepBeats",
    label: "Observed jive chasse step beats",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerJiveChasseDurationsBeats.forEach((v) =>
    positive(v, "callerJiveChasseDurationsBeats"),
  );
  nonnegative(input.callerChasseStartBeat, "callerChasseStartBeat");
  if (
    input.callerJiveChasseDurationsBeats.length !== 3 ||
    input.observedJiveChasseStepBeats.length !== 3
  )
    simpleError("chasse", "Three explicit duration/step entries required.");
  sequence(input.observedJiveChasseStepBeats, "observed");
  let end = input.callerChasseStartBeat;
  const positions = input.callerJiveChasseDurationsBeats.map((v) => {
    const start = end;
    end += v;
    return start;
  });
  return {
    callerJiveChasseStepBeats: positions,
    measuredMinusScoreChasseBeatOffsets: input.observedJiveChasseStepBeats.map(
      (v, i) => v - positions[i],
    ),
    callerChasseEndBeat: end,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerJiveChasseDurationsBeats: [0.75, 0.25, 1],
  callerChasseStartBeat: 0,
  observedJiveChasseStepBeats: [0, 0.75, 1],
} satisfies Input;
export const exampleOutput = {
  callerJiveChasseStepBeats: [0, 0.75, 1],
  measuredMinusScoreChasseBeatOffsets: [0, 0, 0],
  callerChasseEndBeat: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/jive-triple-chasse-beat-values-lookup",
  title: "Jive Triple Chasse Beat Values Lookup",
  description:
    "Expand an actual caller jive chasse duration score and compare measured step onsets; no universal fixed swing ratio or style-independent 3/4–1/4 convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerJiveChasseStepBeats",
      label: "Caller jive chasse step beats",
      kind: "numberList",
    },
    {
      id: "measuredMinusScoreChasseBeatOffsets",
      label: "Measured minus score chasse beat offsets",
      kind: "numberList",
    },
    {
      id: "callerChasseEndBeat",
      label: "Caller chasse end beat",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerJiveChasseDurationsBeats:
        value.callerJiveChasseDurationsBeats as readonly number[],
      callerChasseStartBeat: value.callerChasseStartBeat as number,
      observedJiveChasseStepBeats:
        value.observedJiveChasseStepBeats as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
