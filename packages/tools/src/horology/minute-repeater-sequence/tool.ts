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
  repeater,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedHour24: number;
  readonly observedMinute: number;
  readonly callerLowGongFrequencyHz: number;
  readonly callerHighGongFrequencyHz: number;
}>;
export type Output = Readonly<{
  readonly orderedGongLabels: readonly string[];
  readonly orderedNominalGongFrequenciesHz: readonly number[];
  readonly hourGroupEndExclusiveStrikeIndex: number;
  readonly quarterGroupEndExclusiveStrikeIndex: number;
}>;
const inputFields = [
  { id: "observedHour24", label: "Observed hour24", kind: "number" },
  { id: "observedMinute", label: "Observed minute", kind: "number" },
  {
    id: "callerLowGongFrequencyHz",
    label: "Caller low gong frequency hz",
    kind: "number",
  },
  {
    id: "callerHighGongFrequencyHz",
    label: "Caller high gong frequency hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerLowGongFrequencyHz, "callerLowGongFrequencyHz");
  positive(input.callerHighGongFrequencyHz, "callerHighGongFrequencyHz");
  if (input.callerHighGongFrequencyHz <= input.callerLowGongFrequencyHz)
    simpleError("gongs", "Distinct high frequency must exceed low frequency.");
  const r = repeater(input.observedHour24, input.observedMinute);
  return {
    orderedGongLabels: r.sequence,
    orderedNominalGongFrequenciesHz: r.sequence.map((s) =>
      s === "low"
        ? input.callerLowGongFrequencyHz
        : input.callerHighGongFrequencyHz,
    ),
    hourGroupEndExclusiveStrikeIndex: r.hours,
    quarterGroupEndExclusiveStrikeIndex: r.hours + 2 * r.quarters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHour24: 3,
  observedMinute: 17,
  callerLowGongFrequencyHz: 500,
  callerHighGongFrequencyHz: 800,
} satisfies Input;
export const exampleOutput = {
  orderedGongLabels: ["low", "low", "low", "high", "low", "high", "high"],
  orderedNominalGongFrequenciesHz: [500, 500, 500, 800, 500, 800, 800],
  hourGroupEndExclusiveStrikeIndex: 3,
  quarterGroupEndExclusiveStrikeIndex: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/minute-repeater-sequence",
  title: "Minute Repeater Chime Sequence Calculator",
  description:
    "Construct ordered low/high minute-repeater chime sequence and group boundaries using caller nominal gong frequencies; differs from strike count, assumes hour lows then high-low quarters then minute highs, not generated audio or actual acoustic timing.",
  inputs: inputFields,
  outputs: [
    {
      id: "orderedGongLabels",
      label: "Ordered gong labels",
      kind: "stringList",
    },
    {
      id: "orderedNominalGongFrequenciesHz",
      label: "Ordered nominal gong frequencies hz",
      kind: "numberList",
    },
    {
      id: "hourGroupEndExclusiveStrikeIndex",
      label: "Hour group end exclusive strike index",
      kind: "number",
    },
    {
      id: "quarterGroupEndExclusiveStrikeIndex",
      label: "Quarter group end exclusive strike index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHour24: value.observedHour24 as number,
      observedMinute: value.observedMinute as number,
      callerLowGongFrequencyHz: value.callerLowGongFrequencyHz as number,
      callerHighGongFrequencyHz: value.callerHighGongFrequencyHz as number,
    }),
});
export const run = tool.execute;
export default tool;
