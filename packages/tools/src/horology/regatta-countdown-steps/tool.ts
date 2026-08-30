import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RegattaCountdownStepsInput = Readonly<{
  readonly remainingSeconds: number;
  readonly secondsPerStep: number;
}>;
export type RegattaCountdownStepsOutput = Readonly<{
  readonly completeSteps: number;
}>;

export const calculateRegattaCountdownSteps = (
  x: RegattaCountdownStepsInput,
): RegattaCountdownStepsOutput => {
  if (!Number.isFinite(x.remainingSeconds) || x.remainingSeconds < 0)
    simpleError("remainingSeconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.secondsPerStep) || x.secondsPerStep <= 0)
    simpleError("secondsPerStep", "Provide a finite positive number.");
  const completeSteps = Math.floor(x.remainingSeconds / x.secondsPerStep);
  if (!Number.isFinite(completeSteps))
    simpleError(
      "completeSteps",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { completeSteps: Object.is(completeSteps, -0) ? 0 : completeSteps };
};

export const example = {
  input: {
    remainingSeconds: 300,
    secondsPerStep: 60,
  },
  output: { completeSteps: 5 },
} satisfies ToolExample<
  RegattaCountdownStepsInput,
  RegattaCountdownStepsOutput
>;

export const tool = createSimpleTool({
  id: "horology/regatta-countdown-steps",
  title: "Regatta Countdown Steps",
  description:
    "Number of complete countdown steps in a remaining duration at a specified step size.",
  inputs: [
    {
      id: "remainingSeconds",
      kind: "number",
      label: "Remaining Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "secondsPerStep",
      kind: "number",
      label: "Seconds Per Step",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [{ id: "completeSteps", kind: "number", label: "Complete Steps" }],
  calculate: (input) =>
    calculateRegattaCountdownSteps({
      remainingSeconds: input.remainingSeconds as number,
      secondsPerStep: input.secondsPerStep as number,
    }),
});
export const regattaCountdownStepsTool = tool;
export const runRegattaCountdownSteps = tool.execute;
export default tool;
