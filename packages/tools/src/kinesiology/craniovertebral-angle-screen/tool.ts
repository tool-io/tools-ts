import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly c7ToEarVerticalCm: number;
  readonly c7ToEarForwardCm: number;
  readonly minimumAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly craniovertebralAngleDegrees: number;
  readonly belowTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.c7ToEarVerticalCm < 0 ||
    input.c7ToEarForwardCm <= 0 ||
    input.minimumAngleDegrees < 0 ||
    input.minimumAngleDegrees > 90
  )
    simpleError(
      "c7ToEarForwardCm",
      "Positive forward displacement and valid vertical/angle measurements required.",
    );
  const craniovertebralAngleDegrees =
    (Math.atan2(input.c7ToEarVerticalCm, input.c7ToEarForwardCm) * 180) /
    Math.PI;
  return {
    craniovertebralAngleDegrees,
    belowTarget: craniovertebralAngleDegrees < input.minimumAngleDegrees,
  };
};
export const exampleInput = {
  c7ToEarVerticalCm: 1,
  c7ToEarForwardCm: 1,
  minimumAngleDegrees: 50,
} satisfies Input;
export const exampleOutput = {
  craniovertebralAngleDegrees: 45,
  belowTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/craniovertebral-angle-screen",
  title: "Craniovertebral Angle Screen",
  description:
    "Calculate craniovertebral angle from C7-to-ear coordinates and compare with target.",
  inputs: [
    {
      id: "c7ToEarVerticalCm",
      label: "C 7 to ear vertical cm",
      kind: "number",
    },
    { id: "c7ToEarForwardCm", label: "C 7 to ear forward cm", kind: "number" },
    {
      id: "minimumAngleDegrees",
      label: "Minimum angle degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "craniovertebralAngleDegrees",
      label: "Craniovertebral angle degrees",
      kind: "number",
    },
    { id: "belowTarget", label: "Below target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      c7ToEarVerticalCm: value.c7ToEarVerticalCm as number,
      c7ToEarForwardCm: value.c7ToEarForwardCm as number,
      minimumAngleDegrees: value.minimumAngleDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
