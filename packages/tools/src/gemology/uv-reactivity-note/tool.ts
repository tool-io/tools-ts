import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationTimesSeconds: readonly number[];
  readonly measuredEmissionSignals: readonly number[];
  readonly excitationOffFrameIndex: number;
  readonly backgroundSignal: number;
  readonly callerDetectionExcessThreshold: number;
}>;
export type Output = Readonly<{
  readonly observedPostExcitationExcesses: readonly number[];
  readonly postExcitationDetected: boolean;
  readonly finalFrameAboveCallerDetection: boolean;
  readonly note: string;
}>;
const inputFields = [
  {
    id: "observationTimesSeconds",
    label: "Observation times seconds",
    kind: "numberList",
  },
  {
    id: "measuredEmissionSignals",
    label: "Measured emission signals",
    kind: "numberList",
  },
  {
    id: "excitationOffFrameIndex",
    label: "Excitation off frame index",
    kind: "integer",
  },
  { id: "backgroundSignal", label: "Background signal", kind: "number" },
  {
    id: "callerDetectionExcessThreshold",
    label: "Caller detection excess threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredEmissionSignals.forEach((v) =>
    nonnegative(v, "measuredEmissionSignals"),
  );
  nonnegative(input.backgroundSignal, "backgroundSignal");
  nonnegative(
    input.callerDetectionExcessThreshold,
    "callerDetectionExcessThreshold",
  );
  count(input.excitationOffFrameIndex, "excitationOffFrameIndex");
  ordered(input.observationTimesSeconds, "times");
  aligned(
    input.observationTimesSeconds,
    input.measuredEmissionSignals,
    "frames",
  );
  if (input.excitationOffFrameIndex >= input.measuredEmissionSignals.length)
    simpleError(
      "offFrame",
      "Excitation-off frame must lie in observed sequence.",
    );
  const observedPostExcitationExcesses = input.measuredEmissionSignals
      .slice(input.excitationOffFrameIndex)
      .map((v) => v - input.backgroundSignal),
    postExcitationDetected = observedPostExcitationExcesses.some(
      (v) => v > input.callerDetectionExcessThreshold,
    ),
    finalFrameAboveCallerDetection =
      observedPostExcitationExcesses.at(-1)! >
      input.callerDetectionExcessThreshold;
  return {
    observedPostExcitationExcesses,
    postExcitationDetected,
    finalFrameAboveCallerDetection,
    note: finalFrameAboveCallerDetection
      ? "Post-excitation signal remains detected at the final observed frame."
      : postExcitationDetected
        ? "Post-excitation signal was detected but not at the final observed frame."
        : "No post-excitation signal exceeds the caller detection threshold.",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationTimesSeconds: [0, 1, 2, 3],
  measuredEmissionSignals: [0, 10, 5, 2],
  excitationOffFrameIndex: 2,
  backgroundSignal: 0,
  callerDetectionExcessThreshold: 1,
} satisfies Input;
export const exampleOutput = {
  observedPostExcitationExcesses: [5, 2],
  postExcitationDetected: true,
  finalFrameAboveCallerDetection: true,
  note: "Post-excitation signal remains detected at the final observed frame.",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/uv-reactivity-note",
  title: "UV Reactivity Note Generator",
  description:
    "Produce bounded observation-only UV reactivity note from measured post-excitation frames and caller detection policy; no lifetime extrapolation, phosphorescence mechanism, identity or UV handling advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPostExcitationExcesses",
      label: "Observed post excitation excesses",
      kind: "numberList",
    },
    {
      id: "postExcitationDetected",
      label: "Post excitation detected",
      kind: "boolean",
    },
    {
      id: "finalFrameAboveCallerDetection",
      label: "Final frame above caller detection",
      kind: "boolean",
    },
    { id: "note", label: "Note", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      observationTimesSeconds:
        value.observationTimesSeconds as readonly number[],
      measuredEmissionSignals:
        value.measuredEmissionSignals as readonly number[],
      excitationOffFrameIndex: value.excitationOffFrameIndex as number,
      backgroundSignal: value.backgroundSignal as number,
      callerDetectionExcessThreshold:
        value.callerDetectionExcessThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
