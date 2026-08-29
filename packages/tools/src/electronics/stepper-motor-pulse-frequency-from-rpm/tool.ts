import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StepperMotorPulseFrequencyFromRpmInput = Readonly<{
  readonly speedRpm: number;
  readonly stepsPerRevolution: number;
}>;
export type StepperMotorPulseFrequencyFromRpmOutput = Readonly<{
  pulseFrequencyHz: number;
}>;

export const calculateStepperMotorPulseFrequencyFromRpm = (
  i: StepperMotorPulseFrequencyFromRpmInput,
): StepperMotorPulseFrequencyFromRpmOutput => {
  if (!Number.isSafeInteger(i.stepsPerRevolution))
    simpleError(
      "stepsPerRevolution",
      "Steps per revolution must be an integer.",
    );
  const value = (i.speedRpm * i.stepsPerRevolution) / 60;
  if (!Number.isFinite(value))
    simpleError("pulseFrequencyHz", "The inputs produce a non-finite result.");
  return { pulseFrequencyHz: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { speedRpm: 300, stepsPerRevolution: 200 },
  output: { pulseFrequencyHz: 1000 },
} satisfies ToolExample<
  StepperMotorPulseFrequencyFromRpmInput,
  StepperMotorPulseFrequencyFromRpmOutput
>;

export const tool = createSimpleTool({
  id: "electronics/stepper-motor-pulse-frequency-from-rpm",
  title: "Stepper Motor Pulse Frequency From Rpm",
  description:
    "Convert stepper motor shaft speed to pulse frequency from full or microsteps per revolution; the step count must include the chosen microstepping mode.",
  inputs: [
    {
      id: "speedRpm",
      kind: "number",
      label: "Speed (rpm)",
      unit: "rpm",
      minimum: 0,
    },
    {
      id: "stepsPerRevolution",
      kind: "integer",
      label: "Steps Per Revolution",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "pulseFrequencyHz",
      kind: "number",
      label: "Pulse Frequency (Hz)",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateStepperMotorPulseFrequencyFromRpm({
      speedRpm: input.speedRpm as number,
      stepsPerRevolution: input.stepsPerRevolution as number,
    }),
});
export const stepperMotorPulseFrequencyFromRpmTool = tool;
export const runStepperMotorPulseFrequencyFromRpm = tool.execute;
export default tool;
