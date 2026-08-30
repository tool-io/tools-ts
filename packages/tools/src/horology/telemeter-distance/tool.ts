import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TelemeterDistanceInput = Readonly<{
  readonly delaySeconds: number;
  readonly soundSpeedMetersPerSecond: number;
}>;
export type TelemeterDistanceOutput = Readonly<{
  readonly distanceKilometers: number;
}>;

export const calculateTelemeterDistance = (
  x: TelemeterDistanceInput,
): TelemeterDistanceOutput => {
  if (!Number.isFinite(x.delaySeconds) || x.delaySeconds < 0)
    simpleError("delaySeconds", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite positive number.",
    );
  const distanceKilometers =
    (x.delaySeconds * x.soundSpeedMetersPerSecond) / 1000;
  if (!Number.isFinite(distanceKilometers))
    simpleError(
      "distanceKilometers",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    distanceKilometers: Object.is(distanceKilometers, -0)
      ? 0
      : distanceKilometers,
  };
};

export const example = {
  input: {
    delaySeconds: 3,
    soundSpeedMetersPerSecond: 343,
  },
  output: { distanceKilometers: 1.029 },
} satisfies ToolExample<TelemeterDistanceInput, TelemeterDistanceOutput>;

export const tool = createSimpleTool({
  id: "horology/telemeter-distance",
  title: "Telemeter Distance",
  description:
    "Sound travel distance in kilometres from time between a visible event and its audible arrival.",
  inputs: [
    {
      id: "delaySeconds",
      kind: "number",
      label: "Delay Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "distanceKilometers",
      kind: "number",
      label: "Distance Kilometers",
      unit: "km",
    },
  ],
  calculate: (input) =>
    calculateTelemeterDistance({
      delaySeconds: input.delaySeconds as number,
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
    }),
});
export const telemeterDistanceTool = tool;
export const runTelemeterDistance = tool.execute;
export default tool;
