import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UltrasonicDistanceFromTimeInput = Readonly<{
  readonly roundTripSeconds: number;
  readonly soundSpeedMetersPerSecond: number;
}>;
export type UltrasonicDistanceFromTimeOutput = Readonly<{
  distanceMeters: number;
}>;

export const calculateUltrasonicDistanceFromTime = (
  i: UltrasonicDistanceFromTimeInput,
): UltrasonicDistanceFromTimeOutput => {
  const value = (i.roundTripSeconds * i.soundSpeedMetersPerSecond) / 2;
  if (!Number.isFinite(value))
    simpleError("distanceMeters", "The inputs produce a non-finite result.");
  return { distanceMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { roundTripSeconds: 0.01, soundSpeedMetersPerSecond: 343 },
  output: { distanceMeters: 1.715 },
} satisfies ToolExample<
  UltrasonicDistanceFromTimeInput,
  UltrasonicDistanceFromTimeOutput
>;

export const tool = createSimpleTool({
  id: "electronics/ultrasonic-distance-from-time",
  title: "Ultrasonic Distance From Time",
  description:
    "Calculate ultrasonic pulse-echo target distance from round-trip travel time and assumed sound speed; sound speed must reflect the measurement medium.",
  inputs: [
    {
      id: "roundTripSeconds",
      kind: "number",
      label: "Round Trip (s)",
      unit: "s",
      minimum: 0,
    },
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound speed (m/s)",
      unit: "m/s",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "distanceMeters", kind: "number", label: "Distance (m)", unit: "m" },
  ],
  calculate: (input) =>
    calculateUltrasonicDistanceFromTime({
      roundTripSeconds: input.roundTripSeconds as number,
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
    }),
});
export const ultrasonicDistanceFromTimeTool = tool;
export const runUltrasonicDistanceFromTime = tool.execute;
export default tool;
