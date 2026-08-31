import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedTangoFootfallBeatPositions: readonly number[];
  readonly callerExpectedTangoFootfallBeatPositions: readonly number[];
  readonly callerBeatPositionTolerance: number;
  readonly callerSyncopatedFootfallFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedFootfallBeatDeviations: readonly number[];
  readonly footfallsOutsideCallerTimingIndices: readonly number[];
  readonly unannotatedOffBeatFootfallIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTangoFootfallBeatPositions",
    label: "Observed tango footfall beat positions",
    kind: "numberList",
  },
  {
    id: "callerExpectedTangoFootfallBeatPositions",
    label: "Caller expected tango footfall beat positions",
    kind: "numberList",
  },
  {
    id: "callerBeatPositionTolerance",
    label: "Caller beat position tolerance",
    kind: "number",
  },
  {
    id: "callerSyncopatedFootfallFlags",
    label: "Caller syncopated footfall flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerBeatPositionTolerance, "callerBeatPositionTolerance");
  binary(input.callerSyncopatedFootfallFlags, "callerSyncopatedFootfallFlags");
  aligned(
    input.observedTangoFootfallBeatPositions,
    input.callerExpectedTangoFootfallBeatPositions,
    "observedTangoFootfallBeatPositions",
  );
  aligned(
    input.observedTangoFootfallBeatPositions,
    input.callerSyncopatedFootfallFlags,
    "observedTangoFootfallBeatPositions",
  );
  sequence(input.observedTangoFootfallBeatPositions, "observed");
  sequence(input.callerExpectedTangoFootfallBeatPositions, "score");
  const d = input.observedTangoFootfallBeatPositions.map(
    (v, i) => v - input.callerExpectedTangoFootfallBeatPositions[i],
  );
  return {
    signedFootfallBeatDeviations: d,
    footfallsOutsideCallerTimingIndices: d.flatMap((v, i) =>
      Math.abs(v) > input.callerBeatPositionTolerance ? [i] : [],
    ),
    unannotatedOffBeatFootfallIndices:
      input.observedTangoFootfallBeatPositions.flatMap((v, i) =>
        Math.abs(v - Math.round(v)) > input.callerBeatPositionTolerance &&
        !input.callerSyncopatedFootfallFlags[i]
          ? [i]
          : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTangoFootfallBeatPositions: [0, 1.5, 2, 3],
  callerExpectedTangoFootfallBeatPositions: [0, 1, 2, 3],
  callerBeatPositionTolerance: 0.1,
  callerSyncopatedFootfallFlags: [0, 1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  signedFootfallBeatDeviations: [0, 0.5, 0, 0],
  footfallsOutsideCallerTimingIndices: [1],
  unannotatedOffBeatFootfallIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/tango-walk-beat-syncopation-checker",
  title: "Tango Walk Beat Syncopation Checker",
  description:
    "Audit actual tango footfall timing against caller score plus explicit permitted syncopation annotations; no normative tango rhythm or interpreting syncopation as poor technique.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFootfallBeatDeviations",
      label: "Signed footfall beat deviations",
      kind: "numberList",
    },
    {
      id: "footfallsOutsideCallerTimingIndices",
      label: "Footfalls outside caller timing indices",
      kind: "numberList",
    },
    {
      id: "unannotatedOffBeatFootfallIndices",
      label: "Unannotated off beat footfall indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTangoFootfallBeatPositions:
        value.observedTangoFootfallBeatPositions as readonly number[],
      callerExpectedTangoFootfallBeatPositions:
        value.callerExpectedTangoFootfallBeatPositions as readonly number[],
      callerBeatPositionTolerance: value.callerBeatPositionTolerance as number,
      callerSyncopatedFootfallFlags:
        value.callerSyncopatedFootfallFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
