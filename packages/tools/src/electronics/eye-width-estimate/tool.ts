import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EyeWidthEstimateInput = Readonly<{
  readonly leftCrossingSeconds: number;
  readonly rightCrossingSeconds: number;
}>;
export type EyeWidthEstimateOutput = Readonly<{ eyeWidthSeconds: number }>;

export const calculateEyeWidthEstimate = (
  i: EyeWidthEstimateInput,
): EyeWidthEstimateOutput => {
  if (i.rightCrossingSeconds < i.leftCrossingSeconds)
    simpleError(
      "rightCrossingSeconds",
      "Right crossing must not precede left crossing.",
    );
  const value = i.rightCrossingSeconds - i.leftCrossingSeconds;
  if (!Number.isFinite(value))
    simpleError("eyeWidthSeconds", "The inputs produce a non-finite result.");
  return { eyeWidthSeconds: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { leftCrossingSeconds: 2e-9, rightCrossingSeconds: 8e-9 },
  output: { eyeWidthSeconds: 6.000000000000001e-9 },
} satisfies ToolExample<EyeWidthEstimateInput, EyeWidthEstimateOutput>;

export const tool = createSimpleTool({
  id: "electronics/eye-width-estimate",
  title: "Eye Width Estimate",
  description:
    "Find the horizontal eye opening between the latest left crossing and earliest right crossing in one unit interval.",
  inputs: [
    {
      id: "leftCrossingSeconds",
      kind: "number",
      label: "Left Crossing (s)",
      unit: "s",
      minimum: 0,
    },
    {
      id: "rightCrossingSeconds",
      kind: "number",
      label: "Right Crossing (s)",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "eyeWidthSeconds",
      kind: "number",
      label: "Eye Width (s)",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateEyeWidthEstimate({
      leftCrossingSeconds: input.leftCrossingSeconds as number,
      rightCrossingSeconds: input.rightCrossingSeconds as number,
    }),
});
export const eyeWidthEstimateTool = tool;
export const runEyeWidthEstimate = tool.execute;
export default tool;
