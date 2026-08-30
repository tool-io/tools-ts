import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TachymeterSpeedInput = Readonly<{
  readonly distanceKilometers: number;
  readonly elapsedSeconds: number;
}>;
export type TachymeterSpeedOutput = Readonly<{
  readonly kilometersPerHour: number;
}>;

export const calculateTachymeterSpeed = (
  x: TachymeterSpeedInput,
): TachymeterSpeedOutput => {
  if (!Number.isFinite(x.distanceKilometers) || x.distanceKilometers < 0)
    simpleError("distanceKilometers", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds <= 0)
    simpleError("elapsedSeconds", "Provide a finite positive number.");
  const kilometersPerHour = (3600 * x.distanceKilometers) / x.elapsedSeconds;
  if (!Number.isFinite(kilometersPerHour))
    simpleError(
      "kilometersPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    kilometersPerHour: Object.is(kilometersPerHour, -0) ? 0 : kilometersPerHour,
  };
};

export const example = {
  input: {
    distanceKilometers: 1,
    elapsedSeconds: 30,
  },
  output: { kilometersPerHour: 120 },
} satisfies ToolExample<TachymeterSpeedInput, TachymeterSpeedOutput>;

export const tool = createSimpleTool({
  id: "horology/tachymeter-speed",
  title: "Tachymeter Speed",
  description:
    "Average speed in km/h from distance in kilometres and elapsed seconds.",
  inputs: [
    {
      id: "distanceKilometers",
      kind: "number",
      label: "Distance Kilometers",
      unit: "km",
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
  outputs: [
    {
      id: "kilometersPerHour",
      kind: "number",
      label: "Kilometers Per Hour",
      unit: "km/h",
    },
  ],
  calculate: (input) =>
    calculateTachymeterSpeed({
      distanceKilometers: input.distanceKilometers as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const tachymeterSpeedTool = tool;
export const runTachymeterSpeed = tool.execute;
export default tool;
