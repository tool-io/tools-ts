import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ServoPulseWidthFromAngleInput = Readonly<{
  readonly angleDegrees: number;
  readonly minimumAngleDegrees: number;
  readonly maximumAngleDegrees: number;
  readonly minimumPulseMicroseconds: number;
  readonly maximumPulseMicroseconds: number;
}>;
export type ServoPulseWidthFromAngleOutput = Readonly<{
  pulseWidthMicroseconds: number;
}>;

export const calculateServoPulseWidthFromAngle = (
  i: ServoPulseWidthFromAngleInput,
): ServoPulseWidthFromAngleOutput => {
  if (
    i.maximumAngleDegrees <= i.minimumAngleDegrees ||
    i.maximumPulseMicroseconds <= i.minimumPulseMicroseconds ||
    i.angleDegrees < i.minimumAngleDegrees ||
    i.angleDegrees > i.maximumAngleDegrees
  )
    simpleError(
      "angleDegrees",
      "Angle and pulse endpoints must form increasing calibrated ranges.",
    );
  const value =
    i.minimumPulseMicroseconds +
    ((i.angleDegrees - i.minimumAngleDegrees) *
      (i.maximumPulseMicroseconds - i.minimumPulseMicroseconds)) /
      (i.maximumAngleDegrees - i.minimumAngleDegrees);
  if (!Number.isFinite(value))
    simpleError(
      "pulseWidthMicroseconds",
      "The inputs produce a non-finite result.",
    );
  return { pulseWidthMicroseconds: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    angleDegrees: 90,
    minimumAngleDegrees: 0,
    maximumAngleDegrees: 180,
    minimumPulseMicroseconds: 1000,
    maximumPulseMicroseconds: 2000,
  },
  output: { pulseWidthMicroseconds: 1500 },
} satisfies ToolExample<
  ServoPulseWidthFromAngleInput,
  ServoPulseWidthFromAngleOutput
>;

export const tool = createSimpleTool({
  id: "electronics/servo-pulse-width-from-angle",
  title: "Servo Pulse Width From Angle",
  description:
    "Interpolate a hobby servo command pulse width from angle using the servo's calibrated angle and pulse-width endpoints; do not assume a universal pulse range.",
  inputs: [
    { id: "angleDegrees", kind: "number", label: "Angle (°)", unit: "°" },
    {
      id: "minimumAngleDegrees",
      kind: "number",
      label: "Minimum Angle (°)",
      unit: "°",
    },
    {
      id: "maximumAngleDegrees",
      kind: "number",
      label: "Maximum Angle (°)",
      unit: "°",
    },
    {
      id: "minimumPulseMicroseconds",
      kind: "number",
      label: "Minimum Pulse (µs)",
      unit: "µs",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "maximumPulseMicroseconds",
      kind: "number",
      label: "Maximum Pulse (µs)",
      unit: "µs",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "pulseWidthMicroseconds",
      kind: "number",
      label: "Pulse Width (µs)",
      unit: "µs",
    },
  ],
  calculate: (input) =>
    calculateServoPulseWidthFromAngle({
      angleDegrees: input.angleDegrees as number,
      minimumAngleDegrees: input.minimumAngleDegrees as number,
      maximumAngleDegrees: input.maximumAngleDegrees as number,
      minimumPulseMicroseconds: input.minimumPulseMicroseconds as number,
      maximumPulseMicroseconds: input.maximumPulseMicroseconds as number,
    }),
});
export const servoPulseWidthFromAngleTool = tool;
export const runServoPulseWidthFromAngle = tool.execute;
export default tool;
