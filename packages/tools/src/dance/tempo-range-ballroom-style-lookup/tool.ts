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
  aligned,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerBallroomStyleIds: readonly string[];
  readonly callerMinimumTempoBpm: readonly number[];
  readonly callerMaximumTempoBpm: readonly number[];
  readonly observedTempoBpm: number;
}>;
export type Output = Readonly<{
  readonly callerMatchingStyleIds: readonly string[];
  readonly signedTempoMarginsToStyleRangesBpm: readonly number[];
}>;
const inputFields = [
  {
    id: "callerBallroomStyleIds",
    label: "Caller ballroom style ids",
    kind: "stringList",
  },
  {
    id: "callerMinimumTempoBpm",
    label: "Caller minimum tempo bpm",
    kind: "numberList",
  },
  {
    id: "callerMaximumTempoBpm",
    label: "Caller maximum tempo bpm",
    kind: "numberList",
  },
  { id: "observedTempoBpm", label: "Observed tempo bpm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMinimumTempoBpm.forEach((v) =>
    positive(v, "callerMinimumTempoBpm"),
  );
  input.callerMaximumTempoBpm.forEach((v) =>
    positive(v, "callerMaximumTempoBpm"),
  );
  positive(input.observedTempoBpm, "observedTempoBpm");
  aligned(
    input.callerBallroomStyleIds,
    input.callerMinimumTempoBpm,
    "callerBallroomStyleIds",
  );
  aligned(
    input.callerBallroomStyleIds,
    input.callerMaximumTempoBpm,
    "callerBallroomStyleIds",
  );
  unique(input.callerBallroomStyleIds, "styles");
  if (
    input.callerMinimumTempoBpm.some(
      (v, i) => v > input.callerMaximumTempoBpm[i],
    )
  )
    simpleError(
      "range",
      "Ordered caller style tempo windows required; explicit beats/minute not bars/minute.",
    );
  const margins = input.callerMinimumTempoBpm.map((v, i) =>
    Math.min(
      input.observedTempoBpm - v,
      input.callerMaximumTempoBpm[i] - input.observedTempoBpm,
    ),
  );
  return {
    callerMatchingStyleIds: input.callerBallroomStyleIds.filter(
      (_, i) => margins[i] >= 0,
    ),
    signedTempoMarginsToStyleRangesBpm: margins,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBallroomStyleIds: ["waltz", "tango"],
  callerMinimumTempoBpm: [84, 120],
  callerMaximumTempoBpm: [90, 132],
  observedTempoBpm: 88,
} satisfies Input;
export const exampleOutput = {
  callerMatchingStyleIds: ["waltz"],
  signedTempoMarginsToStyleRangesBpm: [2, -32],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/tempo-range-ballroom-style-lookup",
  title: "Tempo Range Ballroom Style Lookup",
  description:
    "Screen measured tempo against actual caller ballroom style/rulebook BPM ranges with overlap/absence retained; no universal federation ranges or music-style identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchingStyleIds",
      label: "Caller matching style ids",
      kind: "stringList",
    },
    {
      id: "signedTempoMarginsToStyleRangesBpm",
      label: "Signed tempo margins to style ranges bpm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBallroomStyleIds: value.callerBallroomStyleIds as readonly string[],
      callerMinimumTempoBpm: value.callerMinimumTempoBpm as readonly number[],
      callerMaximumTempoBpm: value.callerMaximumTempoBpm as readonly number[],
      observedTempoBpm: value.observedTempoBpm as number,
    }),
});
export const run = tool.execute;
export default tool;
