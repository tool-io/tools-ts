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
  aligned,
  safeText,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerCountInLabels: readonly string[];
  readonly callerCountOneTimeSeconds: number;
  readonly callerAudioSecondsPerCount: number;
  readonly callerCountInSpacingCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly countCallScript: string;
  readonly scheduledCountInTimesSeconds: readonly number[];
  readonly scheduledCountOneTimeSeconds: number;
}>;
const inputFields = [
  {
    id: "callerCountInLabels",
    label: "Caller count in labels",
    kind: "stringList",
  },
  {
    id: "callerCountOneTimeSeconds",
    label: "Caller count one time seconds",
    kind: "number",
  },
  {
    id: "callerAudioSecondsPerCount",
    label: "Caller audio seconds per count",
    kind: "number",
  },
  {
    id: "callerCountInSpacingCounts",
    label: "Caller count in spacing counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerAudioSecondsPerCount, "callerAudioSecondsPerCount");
  input.callerCountInSpacingCounts.forEach((v) =>
    positive(v, "callerCountInSpacingCounts"),
  );
  nonnegative(input.callerCountOneTimeSeconds, "callerCountOneTimeSeconds");
  aligned(
    input.callerCountInLabels,
    input.callerCountInSpacingCounts,
    "callerCountInLabels",
  );
  if (!input.callerCountInLabels.length)
    simpleError("labels", "Explicit count-in labels required.");
  input.callerCountInLabels.forEach((v) => safeText(v, "countLabel"));
  let time = input.callerCountOneTimeSeconds;
  const times = input.callerCountInSpacingCounts.map((v) => v);
  for (let i = times.length - 1; i >= 0; i--) {
    time -=
      input.callerCountInSpacingCounts[i] * input.callerAudioSecondsPerCount;
    times[i] = time;
  }
  if (times[0] < 0)
    simpleError("anchor", "Count-in precedes available audio start.");
  return {
    countCallScript: input.callerCountInLabels.join(" — "),
    scheduledCountInTimesSeconds: times,
    scheduledCountOneTimeSeconds: input.callerCountOneTimeSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCountInLabels: ["5", "6", "7", "8"],
  callerCountOneTimeSeconds: 10,
  callerAudioSecondsPerCount: 0.5,
  callerCountInSpacingCounts: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  countCallScript: "5 — 6 — 7 — 8",
  scheduledCountInTimesSeconds: [8, 8.5, 9, 9.5],
  scheduledCountOneTimeSeconds: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/count-calling-script-5-6-7-8-format-lookup",
  title: 'Count Calling Script "5-6-7-8" Format Lookup',
  description:
    "Schedule actual caller count-in labels/nonuniform gaps backwards from audio count-one anchor, with rendered call script; no automatic spoken audio, fixed 5-6-7-8 convention or guessed downbeat.",
  inputs: inputFields,
  outputs: [
    { id: "countCallScript", label: "Count call script", kind: "string" },
    {
      id: "scheduledCountInTimesSeconds",
      label: "Scheduled count in times seconds",
      kind: "numberList",
    },
    {
      id: "scheduledCountOneTimeSeconds",
      label: "Scheduled count one time seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCountInLabels: value.callerCountInLabels as readonly string[],
      callerCountOneTimeSeconds: value.callerCountOneTimeSeconds as number,
      callerAudioSecondsPerCount: value.callerAudioSecondsPerCount as number,
      callerCountInSpacingCounts:
        value.callerCountInSpacingCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
