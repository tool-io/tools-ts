import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FourthWheelRpmInput = Readonly<{
  readonly secondsPerRevolution: number;
}>;
export type FourthWheelRpmOutput = Readonly<{
  readonly revolutionsPerMinute: number;
}>;

export const calculateFourthWheelRpm = (
  x: FourthWheelRpmInput,
): FourthWheelRpmOutput => {
  if (!Number.isFinite(x.secondsPerRevolution) || x.secondsPerRevolution <= 0)
    simpleError("secondsPerRevolution", "Provide a finite positive number.");
  const revolutionsPerMinute = 60 / x.secondsPerRevolution;
  if (!Number.isFinite(revolutionsPerMinute))
    simpleError(
      "revolutionsPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    revolutionsPerMinute: Object.is(revolutionsPerMinute, -0)
      ? 0
      : revolutionsPerMinute,
  };
};

export const example = {
  input: {
    secondsPerRevolution: 60,
  },
  output: { revolutionsPerMinute: 1 },
} satisfies ToolExample<FourthWheelRpmInput, FourthWheelRpmOutput>;

export const tool = createSimpleTool({
  id: "horology/fourth-wheel-rpm",
  title: "Fourth Wheel Rpm",
  description: "Fourth-wheel rotations per minute from seconds per revolution.",
  inputs: [
    {
      id: "secondsPerRevolution",
      kind: "number",
      label: "Seconds Per Revolution",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "revolutionsPerMinute",
      kind: "number",
      label: "Revolutions Per Minute",
      unit: "rpm",
    },
  ],
  calculate: (input) =>
    calculateFourthWheelRpm({
      secondsPerRevolution: input.secondsPerRevolution as number,
    }),
});
export const fourthWheelRpmTool = tool;
export const runFourthWheelRpm = tool.execute;
export default tool;
