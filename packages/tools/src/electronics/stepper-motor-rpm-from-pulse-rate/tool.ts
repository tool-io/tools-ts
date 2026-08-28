import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StepperMotorRpmFromPulseRateInput = {
  readonly pulseRateHz: number;
  readonly stepsPerRevolutionInt: number;
};

export type StepperMotorRpmFromPulseRateOutput = {
  readonly revolutionsPerMinute: number;
};

export const stepperMotorRpmFromPulseRateExample = {
  input: { pulseRateHz: 3200, stepsPerRevolutionInt: 200 },
  output: { revolutionsPerMinute: 960 },
} satisfies ToolExample<
  StepperMotorRpmFromPulseRateInput,
  StepperMotorRpmFromPulseRateOutput
>;

export const calculateStepperMotorRpmFromPulseRate = (
  input: StepperMotorRpmFromPulseRateInput,
): StepperMotorRpmFromPulseRateOutput => {
  if (!(input.pulseRateHz > 0))
    simpleError("pulseRateHz", "Pulse rate must be positive.", "invalid_rate");
  if (
    !Number.isSafeInteger(input.stepsPerRevolutionInt) ||
    input.stepsPerRevolutionInt < 1
  )
    simpleError(
      "stepsPerRevolutionInt",
      "Steps per revolution must be an integer of at least one.",
      "invalid_steps",
    );
  return {
    revolutionsPerMinute:
      (input.pulseRateHz * 60) / input.stepsPerRevolutionInt,
  };
};

export const stepperMotorRpmFromPulseRateTool = createSimpleTool({
  calculate: (input) =>
    calculateStepperMotorRpmFromPulseRate(
      input as unknown as StepperMotorRpmFromPulseRateInput,
    ),
  description:
    "Compute stepper motor speed in revolutions per minute from a step pulse rate in hertz and the step count per revolution using rpm = pulses * 60 / steps.",
  id: "electronics/stepper-motor-rpm-from-pulse-rate",
  inputs: [
    {
      description: "Step pulse frequency from the controller.",
      id: "pulseRateHz",
      kind: "number",
      label: "Pulse rate",
      unit: "Hz",
    },
    {
      description: "Resolved steps per revolution including microstepping.",
      id: "stepsPerRevolutionInt",
      kind: "integer",
      label: "Steps per revolution",
    },
  ],
  outputs: [
    {
      description: "Shaft speed of the stepper motor.",
      id: "revolutionsPerMinute",
      kind: "number",
      label: "Speed",
      unit: "rpm",
    },
  ],
  title: "Stepper RPM From Pulses",
});
export const runStepperMotorRpmFromPulseRate =
  stepperMotorRpmFromPulseRateTool.execute;
export default stepperMotorRpmFromPulseRateTool;
