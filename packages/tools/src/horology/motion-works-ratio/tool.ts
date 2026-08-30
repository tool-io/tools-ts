import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotionWorksRatioInput = Readonly<{
  readonly driver1Teeth: number;
  readonly driven1Teeth: number;
  readonly driver2Teeth: number;
  readonly driven2Teeth: number;
}>;
export type MotionWorksRatioOutput = Readonly<{
  readonly speedRatio: number;
}>;

export const calculateMotionWorksRatio = (
  x: MotionWorksRatioInput,
): MotionWorksRatioOutput => {
  if (
    !Number.isFinite(x.driver1Teeth) ||
    !Number.isSafeInteger(x.driver1Teeth) ||
    x.driver1Teeth < 1
  )
    simpleError("driver1Teeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.driven1Teeth) ||
    !Number.isSafeInteger(x.driven1Teeth) ||
    x.driven1Teeth < 1
  )
    simpleError("driven1Teeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.driver2Teeth) ||
    !Number.isSafeInteger(x.driver2Teeth) ||
    x.driver2Teeth < 1
  )
    simpleError("driver2Teeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.driven2Teeth) ||
    !Number.isSafeInteger(x.driven2Teeth) ||
    x.driven2Teeth < 1
  )
    simpleError("driven2Teeth", "Provide a positive safe integer.");
  const speedRatio =
    (x.driver1Teeth * x.driver2Teeth) / (x.driven1Teeth * x.driven2Teeth);
  if (!Number.isFinite(speedRatio))
    simpleError(
      "speedRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { speedRatio: Object.is(speedRatio, -0) ? 0 : speedRatio };
};

export const example = {
  input: {
    driver1Teeth: 12,
    driven1Teeth: 36,
    driver2Teeth: 10,
    driven2Teeth: 40,
  },
  output: { speedRatio: 0.08333333333333333 },
} satisfies ToolExample<MotionWorksRatioInput, MotionWorksRatioOutput>;

export const tool = createSimpleTool({
  id: "horology/motion-works-ratio",
  title: "Motion Works Ratio",
  description:
    "Rotational speed ratio across two motion-works gear stages from tooth counts.",
  inputs: [
    {
      id: "driver1Teeth",
      kind: "integer",
      label: "Driver 1 Teeth",
      minimum: 1,
    },
    {
      id: "driven1Teeth",
      kind: "integer",
      label: "Driven 1 Teeth",
      minimum: 1,
    },
    {
      id: "driver2Teeth",
      kind: "integer",
      label: "Driver 2 Teeth",
      minimum: 1,
    },
    {
      id: "driven2Teeth",
      kind: "integer",
      label: "Driven 2 Teeth",
      minimum: 1,
    },
  ],
  outputs: [{ id: "speedRatio", kind: "number", label: "Speed Ratio" }],
  calculate: (input) =>
    calculateMotionWorksRatio({
      driver1Teeth: input.driver1Teeth as number,
      driven1Teeth: input.driven1Teeth as number,
      driver2Teeth: input.driver2Teeth as number,
      driven2Teeth: input.driven2Teeth as number,
    }),
});
export const motionWorksRatioTool = tool;
export const runMotionWorksRatio = tool.execute;
export default tool;
