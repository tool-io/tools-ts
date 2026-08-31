import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  mean,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedDanceCountTimesSeconds: readonly number[];
  readonly callerAudioBeatPeriodSeconds: number;
  readonly callerRelativeFeelTolerance: number;
}>;
export type Output = Readonly<{
  readonly observedDanceCountsPerAudioBeat: number;
  readonly callerMatchedRhythmFeel: string;
  readonly intervalRelativeSpread: number;
}>;
const inputFields = [
  {
    id: "observedDanceCountTimesSeconds",
    label: "Observed dance count times seconds",
    kind: "numberList",
  },
  {
    id: "callerAudioBeatPeriodSeconds",
    label: "Caller audio beat period seconds",
    kind: "number",
  },
  {
    id: "callerRelativeFeelTolerance",
    label: "Caller relative feel tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerAudioBeatPeriodSeconds, "callerAudioBeatPeriodSeconds");
  fraction(input.callerRelativeFeelTolerance, "callerRelativeFeelTolerance");
  strictlyIncreasing(input.observedDanceCountTimesSeconds, "counts");
  const gaps = input.observedDanceCountTimesSeconds
      .slice(1)
      .map((v, i) => v - input.observedDanceCountTimesSeconds[i]),
    period = mean(gaps),
    ratio = input.callerAudioBeatPeriodSeconds / period,
    spread = (Math.max(...gaps) - Math.min(...gaps)) / period;
  let feel = "unmatched-or-variable";
  if (spread <= input.callerRelativeFeelTolerance) {
    const matches = [0.5, 1, 2].flatMap((v, i) =>
      Math.abs(ratio / v - 1) <= input.callerRelativeFeelTolerance ? [i] : [],
    );
    if (matches.length === 1)
      feel = ["half-time", "normal-time", "double-time"][matches[0]];
  }
  return {
    observedDanceCountsPerAudioBeat: ratio,
    callerMatchedRhythmFeel: feel,
    intervalRelativeSpread: spread,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDanceCountTimesSeconds: [0, 1, 2, 3],
  callerAudioBeatPeriodSeconds: 0.5,
  callerRelativeFeelTolerance: 0.05,
} satisfies Input;
export const exampleOutput = {
  observedDanceCountsPerAudioBeat: 0.5,
  callerMatchedRhythmFeel: "half-time",
  intervalRelativeSpread: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/half-time-double-time-rhythm-feel-classifier",
  title: "Half Time Double Time Rhythm Feel Classifier",
  description:
    "Classify actual dance-count timestamps against caller measured audio beat period and tolerance with variable/ambiguous feel retained; not measured swing pairs or simple BPM scaling.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDanceCountsPerAudioBeat",
      label: "Observed dance counts per audio beat",
      kind: "number",
    },
    {
      id: "callerMatchedRhythmFeel",
      label: "Caller matched rhythm feel",
      kind: "string",
    },
    {
      id: "intervalRelativeSpread",
      label: "Interval relative spread",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDanceCountTimesSeconds:
        value.observedDanceCountTimesSeconds as readonly number[],
      callerAudioBeatPeriodSeconds:
        value.callerAudioBeatPeriodSeconds as number,
      callerRelativeFeelTolerance: value.callerRelativeFeelTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
