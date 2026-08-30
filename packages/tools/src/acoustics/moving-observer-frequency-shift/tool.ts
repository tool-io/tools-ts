import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MovingObserverFrequencyShiftInput = Readonly<{
  readonly sourceHertz: number;
  readonly soundSpeedMetersPerSecond: number;
  readonly observerSpeedMetersPerSecond: number;
}>;
export type MovingObserverFrequencyShiftOutput = Readonly<{
  readonly observedHertz: number;
}>;

export const calculateMovingObserverFrequencyShift = (
  x: MovingObserverFrequencyShiftInput,
): MovingObserverFrequencyShiftOutput => {
  if (!Number.isFinite(x.sourceHertz) || x.sourceHertz <= 0)
    simpleError("sourceHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.observerSpeedMetersPerSecond) ||
    x.observerSpeedMetersPerSecond < 0
  )
    simpleError(
      "observerSpeedMetersPerSecond",
      "Provide a finite nonnegative number.",
    );
  const observedHertz =
    (x.sourceHertz *
      (x.soundSpeedMetersPerSecond + x.observerSpeedMetersPerSecond)) /
    x.soundSpeedMetersPerSecond;
  if (!Number.isFinite(observedHertz))
    simpleError(
      "observedHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { observedHertz: Object.is(observedHertz, -0) ? 0 : observedHertz };
};

export const example = {
  input: {
    sourceHertz: 1000,
    soundSpeedMetersPerSecond: 343,
    observerSpeedMetersPerSecond: 10,
  },
  output: { observedHertz: 1029.1545189504373 },
} satisfies ToolExample<
  MovingObserverFrequencyShiftInput,
  MovingObserverFrequencyShiftOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/moving-observer-frequency-shift",
  title: "Moving Observer Frequency Shift",
  description:
    "Observed frequency for a listener moving toward a stationary source through still air.",
  inputs: [
    {
      id: "sourceHertz",
      kind: "number",
      label: "Source Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "observerSpeedMetersPerSecond",
      kind: "number",
      label: "Observer Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "observedHertz",
      kind: "number",
      label: "Observed Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateMovingObserverFrequencyShift({
      sourceHertz: input.sourceHertz as number,
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      observerSpeedMetersPerSecond:
        input.observerSpeedMetersPerSecond as number,
    }),
});
export const movingObserverFrequencyShiftTool = tool;
export const runMovingObserverFrequencyShift = tool.execute;
export default tool;
