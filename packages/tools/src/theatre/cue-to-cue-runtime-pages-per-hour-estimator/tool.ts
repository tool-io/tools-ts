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
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly completedCuePages: number;
  readonly observedCueSessionMinutes: number;
  readonly observedAdministrativeMinutes: number;
  readonly remainingCuePages: number;
  readonly plannedAdministrativeMinutes: number;
}>;
export type Output = Readonly<{
  readonly calibratedActiveCueMinutesPerPage: number;
  readonly estimatedRemainingCueSessionMinutes: number;
}>;
const inputFields = [
  { id: "completedCuePages", label: "Completed cue pages", kind: "number" },
  {
    id: "observedCueSessionMinutes",
    label: "Observed cue session minutes",
    kind: "number",
  },
  {
    id: "observedAdministrativeMinutes",
    label: "Observed administrative minutes",
    kind: "number",
  },
  { id: "remainingCuePages", label: "Remaining cue pages", kind: "number" },
  {
    id: "plannedAdministrativeMinutes",
    label: "Planned administrative minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.completedCuePages, "completedCuePages");
  positive(input.observedCueSessionMinutes, "observedCueSessionMinutes");
  nonnegative(
    input.observedAdministrativeMinutes,
    "observedAdministrativeMinutes",
  );
  nonnegative(input.remainingCuePages, "remainingCuePages");
  nonnegative(
    input.plannedAdministrativeMinutes,
    "plannedAdministrativeMinutes",
  );
  if (input.observedAdministrativeMinutes >= input.observedCueSessionMinutes)
    simpleError(
      "session",
      "Positive observed active cue-to-cue time required.",
    );
  const rate =
    (input.observedCueSessionMinutes - input.observedAdministrativeMinutes) /
    input.completedCuePages;
  return {
    calibratedActiveCueMinutesPerPage: rate,
    estimatedRemainingCueSessionMinutes:
      rate * input.remainingCuePages + input.plannedAdministrativeMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  completedCuePages: 10,
  observedCueSessionMinutes: 60,
  observedAdministrativeMinutes: 10,
  remainingCuePages: 20,
  plannedAdministrativeMinutes: 15,
} satisfies Input;
export const exampleOutput = {
  calibratedActiveCueMinutesPerPage: 5,
  estimatedRemainingCueSessionMinutes: 115,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/cue-to-cue-runtime-pages-per-hour-estimator",
  title: "Cue To Cue Runtime Pages Per Hour Estimator",
  description:
    "Calibrate actual cue-to-cue completed pages excluding measured administrative overhead, then plan remaining session; not universal pages/hour, scripted run time or guaranteed tech throughput.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedActiveCueMinutesPerPage",
      label: "Calibrated active cue minutes per page",
      kind: "number",
    },
    {
      id: "estimatedRemainingCueSessionMinutes",
      label: "Estimated remaining cue session minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      completedCuePages: value.completedCuePages as number,
      observedCueSessionMinutes: value.observedCueSessionMinutes as number,
      observedAdministrativeMinutes:
        value.observedAdministrativeMinutes as number,
      remainingCuePages: value.remainingCuePages as number,
      plannedAdministrativeMinutes:
        value.plannedAdministrativeMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
