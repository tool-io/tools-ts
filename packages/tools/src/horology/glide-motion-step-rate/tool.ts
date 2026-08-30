import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GlideMotionStepRateInput = Readonly<{
  readonly stepsPerHour: number;
}>;
export type GlideMotionStepRateOutput = Readonly<{
  readonly stepsPerSecond: number;
}>;

export const calculateGlideMotionStepRate = (
  x: GlideMotionStepRateInput,
): GlideMotionStepRateOutput => {
  if (!Number.isFinite(x.stepsPerHour) || x.stepsPerHour <= 0)
    simpleError("stepsPerHour", "Provide a finite positive number.");
  const stepsPerSecond = x.stepsPerHour / 3600;
  if (!Number.isFinite(stepsPerSecond))
    simpleError(
      "stepsPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { stepsPerSecond: Object.is(stepsPerSecond, -0) ? 0 : stepsPerSecond };
};

export const example = {
  input: {
    stepsPerHour: 3600,
  },
  output: { stepsPerSecond: 1 },
} satisfies ToolExample<GlideMotionStepRateInput, GlideMotionStepRateOutput>;

export const tool = createSimpleTool({
  id: "horology/glide-motion-step-rate",
  title: "Glide Motion Step Rate",
  description:
    "Continuous-motion hand-control step rate in steps per second from supplied steps per hour.",
  inputs: [
    {
      id: "stepsPerHour",
      kind: "number",
      label: "Steps Per Hour",
      unit: "step/h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stepsPerSecond",
      kind: "number",
      label: "Steps Per Second",
      unit: "step/s",
    },
  ],
  calculate: (input) =>
    calculateGlideMotionStepRate({
      stepsPerHour: input.stepsPerHour as number,
    }),
});
export const glideMotionStepRateTool = tool;
export const runGlideMotionStepRate = tool.execute;
export default tool;
