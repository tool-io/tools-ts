import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DopplerApproachingFrequencyInput = Readonly<{
  readonly sourceHertz: number;
  readonly soundSpeedMetersPerSecond: number;
  readonly sourceSpeedMetersPerSecond: number;
}>;
export type DopplerApproachingFrequencyOutput = Readonly<{
  readonly observedHertz: number;
}>;

export const calculateDopplerApproachingFrequency = (
  x: DopplerApproachingFrequencyInput,
): DopplerApproachingFrequencyOutput => {
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
    !Number.isFinite(x.sourceSpeedMetersPerSecond) ||
    x.sourceSpeedMetersPerSecond < 0
  )
    simpleError(
      "sourceSpeedMetersPerSecond",
      "Provide a finite nonnegative number.",
    );
  if (!(x.sourceSpeedMetersPerSecond < x.soundSpeedMetersPerSecond))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const observedHertz =
    (x.sourceHertz * x.soundSpeedMetersPerSecond) /
    (x.soundSpeedMetersPerSecond - x.sourceSpeedMetersPerSecond);
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
    sourceSpeedMetersPerSecond: 10,
  },
  output: { observedHertz: 1030.03003003003 },
} satisfies ToolExample<
  DopplerApproachingFrequencyInput,
  DopplerApproachingFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/doppler-approaching-frequency",
  title: "Doppler Approaching Frequency",
  description:
    "Observed frequency from a source approaching a stationary listener through still air.",
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
      id: "sourceSpeedMetersPerSecond",
      kind: "number",
      label: "Source Speed Meters Per Second",
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
    calculateDopplerApproachingFrequency({
      sourceHertz: input.sourceHertz as number,
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      sourceSpeedMetersPerSecond: input.sourceSpeedMetersPerSecond as number,
    }),
});
export const dopplerApproachingFrequencyTool = tool;
export const runDopplerApproachingFrequency = tool.execute;
export default tool;
