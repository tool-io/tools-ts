import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FoudroyanteStepsInput = Readonly<{
  readonly stepsPerSecond: number;
  readonly elapsedSeconds: number;
}>;
export type FoudroyanteStepsOutput = Readonly<{
  readonly steps: number;
}>;

export const calculateFoudroyanteSteps = (
  x: FoudroyanteStepsInput,
): FoudroyanteStepsOutput => {
  if (!Number.isFinite(x.stepsPerSecond) || x.stepsPerSecond <= 0)
    simpleError("stepsPerSecond", "Provide a finite positive number.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds < 0)
    simpleError("elapsedSeconds", "Provide a finite nonnegative number.");
  const steps = Math.floor(x.stepsPerSecond * x.elapsedSeconds);
  if (!Number.isFinite(steps))
    simpleError("steps", "Inputs produce an undefined or out-of-range result.");
  return { steps: Object.is(steps, -0) ? 0 : steps };
};

export const example = {
  input: {
    stepsPerSecond: 8,
    elapsedSeconds: 10,
  },
  output: { steps: 80 },
} satisfies ToolExample<FoudroyanteStepsInput, FoudroyanteStepsOutput>;

export const tool = createSimpleTool({
  id: "horology/foudroyante-steps",
  title: "Foudroyante Steps",
  description:
    "Foudroyante indication steps completed over elapsed seconds at a specified step frequency.",
  inputs: [
    {
      id: "stepsPerSecond",
      kind: "number",
      label: "Steps Per Second",
      unit: "step/s",
      minimum: 0,
    },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [{ id: "steps", kind: "number", label: "Steps" }],
  calculate: (input) =>
    calculateFoudroyanteSteps({
      stepsPerSecond: input.stepsPerSecond as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const foudroyanteStepsTool = tool;
export const runFoudroyanteSteps = tool.execute;
export default tool;
