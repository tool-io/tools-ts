import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly countedSteps: number;
  readonly observationSeconds: number;
}>;
export type Output = Readonly<{
  readonly cadenceStepsPerMinute: number;
  readonly secondsPerGaitCycle: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.countedSteps) ||
    input.countedSteps < 2 ||
    input.observationSeconds <= 0
  )
    simpleError(
      "countedSteps",
      "At least two counted steps and positive observation time required.",
    );
  const cadenceStepsPerMinute =
    (60 * input.countedSteps) / input.observationSeconds;
  return {
    cadenceStepsPerMinute,
    secondsPerGaitCycle: 120 / cadenceStepsPerMinute,
  };
};
export const exampleInput = {
  countedSteps: 120,
  observationSeconds: 60,
} satisfies Input;
export const exampleOutput = {
  cadenceStepsPerMinute: 120,
  secondsPerGaitCycle: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/gait-cadence-from-step-count",
  title: "Gait Cadence From Step Count",
  description:
    "Compute walking cadence and two-step gait-cycle duration from step counts.",
  inputs: [
    { id: "countedSteps", label: "Counted steps", kind: "number" },
    { id: "observationSeconds", label: "Observation seconds", kind: "number" },
  ],
  outputs: [
    {
      id: "cadenceStepsPerMinute",
      label: "Cadence steps per minute",
      kind: "number",
    },
    {
      id: "secondsPerGaitCycle",
      label: "Seconds per gait cycle",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      countedSteps: value.countedSteps as number,
      observationSeconds: value.observationSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
