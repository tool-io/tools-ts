import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StoppingSightDistanceInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly reactionSeconds: number;
  readonly decelerationMetersPerSecondSquared: number;
}>;
export type StoppingSightDistanceOutput = Readonly<{
  readonly distanceMeters: number;
}>;

export const calculateStoppingSightDistance = (
  x: StoppingSightDistanceInput,
): StoppingSightDistanceOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.reactionSeconds) || x.reactionSeconds < 0)
    simpleError("reactionSeconds", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.decelerationMetersPerSecondSquared) ||
    x.decelerationMetersPerSecondSquared < 0
  )
    simpleError(
      "decelerationMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  const distanceMeters =
    x.speedMetersPerSecond * x.reactionSeconds +
    x.speedMetersPerSecond ** 2 / (2 * x.decelerationMetersPerSecondSquared);
  if (!Number.isFinite(distanceMeters))
    simpleError(
      "distanceMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { distanceMeters: Object.is(distanceMeters, -0) ? 0 : distanceMeters };
};

export const example = {
  input: {
    speedMetersPerSecond: 20,
    reactionSeconds: 2,
    decelerationMetersPerSecondSquared: 5,
  },
  output: { distanceMeters: 80 },
} satisfies ToolExample<
  StoppingSightDistanceInput,
  StoppingSightDistanceOutput
>;

export const tool = createSimpleTool({
  id: "engineering/stopping-sight-distance",
  title: "Stopping Sight Distance",
  description:
    "Level-road stopping distance vt+v²/(2a) from speed, perception–reaction time and constant braking deceleration.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "reactionSeconds",
      kind: "number",
      label: "Reaction Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "decelerationMetersPerSecondSquared",
      kind: "number",
      label: "Deceleration Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "distanceMeters",
      kind: "number",
      label: "Distance Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateStoppingSightDistance({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      reactionSeconds: input.reactionSeconds as number,
      decelerationMetersPerSecondSquared:
        input.decelerationMetersPerSecondSquared as number,
    }),
});
export const stoppingSightDistanceTool = tool;
export const runStoppingSightDistance = tool.execute;
export default tool;
