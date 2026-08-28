import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StepperMotorStepsPerRevolutionInput = {
  readonly fullStepsPerRevInt?: number;
  readonly microsteppingInt?: number;
};

export type StepperMotorStepsPerRevolutionOutput = {
  readonly stepsPerRevolution: number;
};

export const stepperMotorStepsPerRevolutionExample = {
  input: { fullStepsPerRevInt: 200, microsteppingInt: 16 },
  output: { stepsPerRevolution: 3200 },
} satisfies ToolExample<
  StepperMotorStepsPerRevolutionInput,
  StepperMotorStepsPerRevolutionOutput
>;

export const calculateStepperMotorStepsPerRevolution = (
  input: StepperMotorStepsPerRevolutionInput,
): StepperMotorStepsPerRevolutionOutput => {
  const fullStepsPerRevInt = input.fullStepsPerRevInt ?? 200;
  if (!Number.isSafeInteger(fullStepsPerRevInt) || fullStepsPerRevInt < 1)
    simpleError(
      "fullStepsPerRevInt",
      "Full steps per revolution must be an integer of at least one.",
      "invalid_steps",
    );
  const microsteppingInt = input.microsteppingInt ?? 1;
  if (
    !Number.isSafeInteger(microsteppingInt) ||
    microsteppingInt < 1 ||
    microsteppingInt > 256
  )
    simpleError(
      "microsteppingInt",
      "Microstepping must be an integer between 1 and 256.",
      "invalid_microstepping",
    );
  return { stepsPerRevolution: fullStepsPerRevInt * microsteppingInt };
};

export const stepperMotorStepsPerRevolutionTool = createSimpleTool({
  calculate: (input) =>
    calculateStepperMotorStepsPerRevolution(
      input as unknown as StepperMotorStepsPerRevolutionInput,
    ),
  description:
    "Compute the resolved step count per revolution of a stepper motor from its full steps per revolution and the microstepping divisor, which defaults to 200 full steps and no microstepping.",
  id: "electronics/stepper-motor-steps-per-revolution",
  inputs: [
    {
      default: 200,
      description: "Full steps per revolution, 200 for a 1.8 degree motor.",
      id: "fullStepsPerRevInt",
      kind: "integer",
      label: "Full steps per revolution",
    },
    {
      default: 1,
      description: "Microstepping divisor between 1 and 256.",
      id: "microsteppingInt",
      kind: "integer",
      label: "Microstepping",
    },
  ],
  outputs: [
    {
      description: "Microsteps per revolution after dividing.",
      id: "stepsPerRevolution",
      kind: "integer",
      label: "Steps per revolution",
    },
  ],
  title: "Stepper Steps/Rev",
});
export const runStepperMotorStepsPerRevolution =
  stepperMotorStepsPerRevolutionTool.execute;
export default stepperMotorStepsPerRevolutionTool;
