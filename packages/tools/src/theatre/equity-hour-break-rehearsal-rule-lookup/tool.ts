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
  intervals,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly rehearsalWindowMinutes: number;
  readonly observedBreakIntervalsMinutes: readonly (readonly number[])[];
  readonly callerMaximumContinuousWorkMinutes: number;
  readonly callerMinimumQualifyingBreakMinutes: number;
}>;
export type Output = Readonly<{
  readonly qualifyingBreakCount: number;
  readonly continuousWorkIntervalsMinutes: readonly number[];
  readonly continuousWorkIntervalsOverCallerPolicy: readonly number[];
}>;
const inputFields = [
  {
    id: "rehearsalWindowMinutes",
    label: "Rehearsal window minutes",
    kind: "number",
  },
  {
    id: "observedBreakIntervalsMinutes",
    label: "Observed break intervals minutes",
    kind: "matrix",
  },
  {
    id: "callerMaximumContinuousWorkMinutes",
    label: "Caller maximum continuous work minutes",
    kind: "number",
  },
  {
    id: "callerMinimumQualifyingBreakMinutes",
    label: "Caller minimum qualifying break minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rehearsalWindowMinutes, "rehearsalWindowMinutes");
  positive(
    input.callerMaximumContinuousWorkMinutes,
    "callerMaximumContinuousWorkMinutes",
  );
  positive(
    input.callerMinimumQualifyingBreakMinutes,
    "callerMinimumQualifyingBreakMinutes",
  );
  intervals(input.observedBreakIntervalsMinutes, input.rehearsalWindowMinutes);
  const breaks = input.observedBreakIntervalsMinutes
    .map((r) => [...r])
    .sort((a, b) => a[0] - b[0]);
  if (breaks.some((r, i) => i > 0 && r[0] < breaks[i - 1][1]))
    simpleError("breaks", "Nonoverlapping observed break intervals required.");
  const qualified = breaks.filter(
      ([a, b]) => b - a >= input.callerMinimumQualifyingBreakMinutes,
    ),
    work: number[] = [];
  let end = 0;
  for (const [a, b] of qualified) {
    work.push(a - end);
    end = b;
  }
  work.push(input.rehearsalWindowMinutes - end);
  return {
    qualifyingBreakCount: qualified.length,
    continuousWorkIntervalsMinutes: work,
    continuousWorkIntervalsOverCallerPolicy: work.flatMap((v, i) =>
      v > input.callerMaximumContinuousWorkMinutes ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rehearsalWindowMinutes: 120,
  observedBreakIntervalsMinutes: [
    [50, 60],
    [110, 120],
  ],
  callerMaximumContinuousWorkMinutes: 50,
  callerMinimumQualifyingBreakMinutes: 10,
} satisfies Input;
export const exampleOutput = {
  qualifyingBreakCount: 2,
  continuousWorkIntervalsMinutes: [50, 50, 0],
  continuousWorkIntervalsOverCallerPolicy: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/equity-hour-break-rehearsal-rule-lookup",
  title: "Equity Hour Break Rehearsal Rule Lookup",
  description:
    "Audit actual rehearsal break log against independently supplied applicable contract work/break thresholds; short breaks do not reset caller continuous-work clock, no invented Equity rules, legal compliance or fatigue safety determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifyingBreakCount",
      label: "Qualifying break count",
      kind: "number",
    },
    {
      id: "continuousWorkIntervalsMinutes",
      label: "Continuous work intervals minutes",
      kind: "numberList",
    },
    {
      id: "continuousWorkIntervalsOverCallerPolicy",
      label: "Continuous work intervals over caller policy",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      rehearsalWindowMinutes: value.rehearsalWindowMinutes as number,
      observedBreakIntervalsMinutes:
        value.observedBreakIntervalsMinutes as readonly (readonly number[])[],
      callerMaximumContinuousWorkMinutes:
        value.callerMaximumContinuousWorkMinutes as number,
      callerMinimumQualifyingBreakMinutes:
        value.callerMinimumQualifyingBreakMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
