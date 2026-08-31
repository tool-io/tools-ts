import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly meltPeakHourOnCallerCycle: number;
  readonly runoffPeakHourOnCallerCycle: number;
  readonly callerDiurnalCycleHours: number;
}>;
export type Output = Readonly<{
  readonly forwardCircularPeakLagHours: number;
  readonly signedShortestPeakOffsetHours: number;
}>;
const inputFields = [
  {
    id: "meltPeakHourOnCallerCycle",
    label: "Melt peak hour on caller cycle",
    kind: "number",
  },
  {
    id: "runoffPeakHourOnCallerCycle",
    label: "Runoff peak hour on caller cycle",
    kind: "number",
  },
  {
    id: "callerDiurnalCycleHours",
    label: "Caller diurnal cycle hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerDiurnalCycleHours, "callerDiurnalCycleHours");
  if (
    input.meltPeakHourOnCallerCycle < 0 ||
    input.runoffPeakHourOnCallerCycle < 0 ||
    input.meltPeakHourOnCallerCycle >= input.callerDiurnalCycleHours ||
    input.runoffPeakHourOnCallerCycle >= input.callerDiurnalCycleHours
  )
    simpleError("phase", "Observed phases must lie in caller common cycle.");
  const lag =
    (((input.runoffPeakHourOnCallerCycle - input.meltPeakHourOnCallerCycle) %
      input.callerDiurnalCycleHours) +
      input.callerDiurnalCycleHours) %
    input.callerDiurnalCycleHours;
  return {
    forwardCircularPeakLagHours: lag,
    signedShortestPeakOffsetHours:
      lag >= input.callerDiurnalCycleHours / 2
        ? lag - input.callerDiurnalCycleHours
        : lag,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  meltPeakHourOnCallerCycle: 23,
  runoffPeakHourOnCallerCycle: 2,
  callerDiurnalCycleHours: 24,
} satisfies Input;
export const exampleOutput = {
  forwardCircularPeakLagHours: 3,
  signedShortestPeakOffsetHours: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/runoff-diurnal-peak-lag",
  title: "Runoff Diurnal Peak Lag Calculator",
  description:
    "Compare actual peak phases on caller common diurnal cycle, reporting forward lag and shortest signed offset with negative half-cycle tie; not time-zone conversion, physical causal routing delay or inferring peaks from absent series.",
  inputs: inputFields,
  outputs: [
    {
      id: "forwardCircularPeakLagHours",
      label: "Forward circular peak lag hours",
      kind: "number",
    },
    {
      id: "signedShortestPeakOffsetHours",
      label: "Signed shortest peak offset hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      meltPeakHourOnCallerCycle: value.meltPeakHourOnCallerCycle as number,
      runoffPeakHourOnCallerCycle: value.runoffPeakHourOnCallerCycle as number,
      callerDiurnalCycleHours: value.callerDiurnalCycleHours as number,
    }),
});
export const run = tool.execute;
export default tool;
