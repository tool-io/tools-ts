import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly callerRatedWorkingVoltageVrms: number;
  readonly callerRatedTestVoltageVrms: number;
  readonly callerRatedTestDurationSeconds: number;
  readonly intendedWorkingVoltageVrms: number;
  readonly observedTestVoltageVrms: number;
  readonly observedTestDurationSeconds: number;
  readonly testWaveformAndConditionsMatched: boolean;
}>;
export type Output = Readonly<{
  readonly signedWorkingVoltageMarginVrms: number;
  readonly workingVoltageWithinCallerRating: boolean;
  readonly observedTestMatchesSuppliedVoltageDuration: boolean;
}>;
const inputFields = [
  {
    id: "callerRatedWorkingVoltageVrms",
    label: "Caller rated working voltage vrms",
    kind: "number",
  },
  {
    id: "callerRatedTestVoltageVrms",
    label: "Caller rated test voltage vrms",
    kind: "number",
  },
  {
    id: "callerRatedTestDurationSeconds",
    label: "Caller rated test duration seconds",
    kind: "number",
  },
  {
    id: "intendedWorkingVoltageVrms",
    label: "Intended working voltage vrms",
    kind: "number",
  },
  {
    id: "observedTestVoltageVrms",
    label: "Observed test voltage vrms",
    kind: "number",
  },
  {
    id: "observedTestDurationSeconds",
    label: "Observed test duration seconds",
    kind: "number",
  },
  {
    id: "testWaveformAndConditionsMatched",
    label: "Test waveform and conditions matched",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerRatedWorkingVoltageVrms,
    "callerRatedWorkingVoltageVrms",
  );
  positive(input.callerRatedTestVoltageVrms, "callerRatedTestVoltageVrms");
  positive(
    input.callerRatedTestDurationSeconds,
    "callerRatedTestDurationSeconds",
  );
  nonnegative(input.intendedWorkingVoltageVrms, "intendedWorkingVoltageVrms");
  nonnegative(input.observedTestVoltageVrms, "observedTestVoltageVrms");
  nonnegative(input.observedTestDurationSeconds, "observedTestDurationSeconds");
  return {
    signedWorkingVoltageMarginVrms:
      input.callerRatedWorkingVoltageVrms - input.intendedWorkingVoltageVrms,
    workingVoltageWithinCallerRating:
      input.intendedWorkingVoltageVrms <= input.callerRatedWorkingVoltageVrms,
    observedTestMatchesSuppliedVoltageDuration:
      input.testWaveformAndConditionsMatched &&
      input.observedTestVoltageVrms === input.callerRatedTestVoltageVrms &&
      input.observedTestDurationSeconds ===
        input.callerRatedTestDurationSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRatedWorkingVoltageVrms: 250,
  callerRatedTestVoltageVrms: 2500,
  callerRatedTestDurationSeconds: 60,
  intendedWorkingVoltageVrms: 300,
  observedTestVoltageVrms: 2500,
  observedTestDurationSeconds: 60,
  testWaveformAndConditionsMatched: true,
} satisfies Input;
export const exampleOutput = {
  signedWorkingVoltageMarginVrms: -50,
  workingVoltageWithinCallerRating: false,
  observedTestMatchesSuppliedVoltageDuration: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/optocoupler-isolation-voltage",
  title: "Optocoupler Isolation Voltage Calculator",
  description:
    "Audit actual optocoupler working voltage separately from supplied isolation-test voltage/duration and caller condition evidence; passing hypot data does not authorize continuous test-level operation, certify insulation, creepage or electrical safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedWorkingVoltageMarginVrms",
      label: "Signed working voltage margin vrms",
      kind: "number",
    },
    {
      id: "workingVoltageWithinCallerRating",
      label: "Working voltage within caller rating",
      kind: "boolean",
    },
    {
      id: "observedTestMatchesSuppliedVoltageDuration",
      label: "Observed test matches supplied voltage duration",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRatedWorkingVoltageVrms:
        value.callerRatedWorkingVoltageVrms as number,
      callerRatedTestVoltageVrms: value.callerRatedTestVoltageVrms as number,
      callerRatedTestDurationSeconds:
        value.callerRatedTestDurationSeconds as number,
      intendedWorkingVoltageVrms: value.intendedWorkingVoltageVrms as number,
      observedTestVoltageVrms: value.observedTestVoltageVrms as number,
      observedTestDurationSeconds: value.observedTestDurationSeconds as number,
      testWaveformAndConditionsMatched:
        value.testWaveformAndConditionsMatched as boolean,
    }),
});
export const run = tool.execute;
export default tool;
