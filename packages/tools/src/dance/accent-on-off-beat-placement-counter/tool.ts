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
  fraction,
  modulo,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedAccentBeatPositions: readonly number[];
  readonly callerNearestBeatTolerance: number;
  readonly callerOffBeatPhase: number;
}>;
export type Output = Readonly<{
  readonly onBeatAccentCount: number;
  readonly callerOffBeatAccentCount: number;
  readonly unclassifiedAccentIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAccentBeatPositions",
    label: "Observed accent beat positions",
    kind: "numberList",
  },
  {
    id: "callerNearestBeatTolerance",
    label: "Caller nearest beat tolerance",
    kind: "number",
  },
  { id: "callerOffBeatPhase", label: "Caller off beat phase", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAccentBeatPositions.forEach((v) =>
    nonnegative(v, "observedAccentBeatPositions"),
  );
  nonnegative(input.callerNearestBeatTolerance, "callerNearestBeatTolerance");
  fraction(input.callerOffBeatPhase, "callerOffBeatPhase");
  if (
    input.callerNearestBeatTolerance >= 0.25 ||
    input.callerOffBeatPhase <= 2 * input.callerNearestBeatTolerance ||
    1 - input.callerOffBeatPhase <= 2 * input.callerNearestBeatTolerance
  )
    simpleError(
      "phase",
      "Disjoint on/off phase windows and tolerance <.25 required.",
    );
  let on = 0,
    off = 0;
  const unknown: number[] = [];
  input.observedAccentBeatPositions.forEach((v, i) => {
    const phase = modulo(v, 1),
      distance = (target: number) =>
        Math.min(Math.abs(phase - target), 1 - Math.abs(phase - target));
    if (distance(0) <= input.callerNearestBeatTolerance) on++;
    else if (
      distance(input.callerOffBeatPhase) <= input.callerNearestBeatTolerance
    )
      off++;
    else unknown.push(i);
  });
  return {
    onBeatAccentCount: on,
    callerOffBeatAccentCount: off,
    unclassifiedAccentIndices: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAccentBeatPositions: [0, 0.5, 1.02, 1.25],
  callerNearestBeatTolerance: 0.05,
  callerOffBeatPhase: 0.5,
} satisfies Input;
export const exampleOutput = {
  onBeatAccentCount: 2,
  callerOffBeatAccentCount: 1,
  unclassifiedAccentIndices: [3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/accent-on-off-beat-placement-counter",
  title: "Accent On Off Beat Placement Counter",
  description:
    "Classify actual dance accent phases under caller disjoint on/off-beat windows, retaining other subdivisions; not forced binary syncopation or inferred musical accent detection.",
  inputs: inputFields,
  outputs: [
    { id: "onBeatAccentCount", label: "On beat accent count", kind: "number" },
    {
      id: "callerOffBeatAccentCount",
      label: "Caller off beat accent count",
      kind: "number",
    },
    {
      id: "unclassifiedAccentIndices",
      label: "Unclassified accent indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAccentBeatPositions:
        value.observedAccentBeatPositions as readonly number[],
      callerNearestBeatTolerance: value.callerNearestBeatTolerance as number,
      callerOffBeatPhase: value.callerOffBeatPhase as number,
    }),
});
export const run = tool.execute;
export default tool;
