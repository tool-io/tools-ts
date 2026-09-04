import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedEscalatorStepSpeedMSecond: number;
  readonly observedStepPitchM: number;
  readonly callerObservedMeanPassengersPerStep: number;
  readonly callerOperatingFraction: number;
}>;
export type Output = Readonly<{
  readonly modeledObservedEscalatorPassengersHour: number;
}>;
const inputFields = [
  {
    id: "observedEscalatorStepSpeedMSecond",
    label: "Observed escalator step speed m second",
    kind: "number",
  },
  { id: "observedStepPitchM", label: "Observed step pitch m", kind: "number" },
  {
    id: "callerObservedMeanPassengersPerStep",
    label: "Caller observed mean passengers per step",
    kind: "number",
  },
  {
    id: "callerOperatingFraction",
    label: "Caller operating fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedStepPitchM, "observedStepPitchM");
  nonnegative(
    input.observedEscalatorStepSpeedMSecond,
    "observedEscalatorStepSpeedMSecond",
  );
  nonnegative(
    input.callerObservedMeanPassengersPerStep,
    "callerObservedMeanPassengersPerStep",
  );
  fraction(input.callerOperatingFraction, "callerOperatingFraction");
  return {
    modeledObservedEscalatorPassengersHour:
      ((3600 * input.observedEscalatorStepSpeedMSecond) /
        input.observedStepPitchM) *
      input.callerObservedMeanPassengersPerStep *
      input.callerOperatingFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEscalatorStepSpeedMSecond: 0.5,
  observedStepPitchM: 0.4,
  callerObservedMeanPassengersPerStep: 1.2,
  callerOperatingFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  modeledObservedEscalatorPassengersHour: 4320,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/escalator-capacity",
  title: "Escalator Capacity Calculator",
  description:
    "Step throughput with independently observed occupancy/duty, not an equipment passenger safety rating. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledObservedEscalatorPassengersHour",
      label: "Modeled observed escalator passengers hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEscalatorStepSpeedMSecond:
        value.observedEscalatorStepSpeedMSecond as number,
      observedStepPitchM: value.observedStepPitchM as number,
      callerObservedMeanPassengersPerStep:
        value.callerObservedMeanPassengersPerStep as number,
      callerOperatingFraction: value.callerOperatingFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
