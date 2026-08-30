import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmplitudeLiftRatioInput = Readonly<{
  readonly actualLiftDegrees: number;
  readonly assumedLiftDegrees: number;
}>;
export type AmplitudeLiftRatioOutput = Readonly<{
  readonly liftRatio: number;
}>;

export const calculateAmplitudeLiftRatio = (
  x: AmplitudeLiftRatioInput,
): AmplitudeLiftRatioOutput => {
  if (!Number.isFinite(x.actualLiftDegrees) || x.actualLiftDegrees <= 0)
    simpleError("actualLiftDegrees", "Provide a finite positive number.");
  if (!Number.isFinite(x.assumedLiftDegrees) || x.assumedLiftDegrees <= 0)
    simpleError("assumedLiftDegrees", "Provide a finite positive number.");
  const liftRatio = x.actualLiftDegrees / x.assumedLiftDegrees;
  if (!Number.isFinite(liftRatio))
    simpleError(
      "liftRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { liftRatio: Object.is(liftRatio, -0) ? 0 : liftRatio };
};

export const example = {
  input: {
    actualLiftDegrees: 52,
    assumedLiftDegrees: 50,
  },
  output: { liftRatio: 1.04 },
} satisfies ToolExample<AmplitudeLiftRatioInput, AmplitudeLiftRatioOutput>;

export const tool = createSimpleTool({
  id: "horology/amplitude-lift-ratio",
  title: "Amplitude Lift Ratio",
  description:
    "Ratio of a movement's actual lift angle to the lift angle assumed in an amplitude calculation.",
  inputs: [
    {
      id: "actualLiftDegrees",
      kind: "number",
      label: "Actual Lift Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "assumedLiftDegrees",
      kind: "number",
      label: "Assumed Lift Degrees",
      unit: "deg",
      minimum: 0,
    },
  ],
  outputs: [{ id: "liftRatio", kind: "number", label: "Lift Ratio" }],
  calculate: (input) =>
    calculateAmplitudeLiftRatio({
      actualLiftDegrees: input.actualLiftDegrees as number,
      assumedLiftDegrees: input.assumedLiftDegrees as number,
    }),
});
export const amplitudeLiftRatioTool = tool;
export const runAmplitudeLiftRatio = tool.execute;
export default tool;
