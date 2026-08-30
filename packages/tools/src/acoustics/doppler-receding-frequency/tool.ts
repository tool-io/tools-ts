import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DopplerRecedingFrequencyInput = Readonly<{
  readonly sourceHertz: number;
  readonly soundSpeedMetersPerSecond: number;
  readonly sourceSpeedMetersPerSecond: number;
}>;
export type DopplerRecedingFrequencyOutput = Readonly<{
  readonly observedHertz: number;
}>;

export const calculateDopplerRecedingFrequency = (
  x: DopplerRecedingFrequencyInput,
): DopplerRecedingFrequencyOutput => {
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
  const observedHertz =
    (x.sourceHertz * x.soundSpeedMetersPerSecond) /
    (x.soundSpeedMetersPerSecond + x.sourceSpeedMetersPerSecond);
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
  output: { observedHertz: 971.671388101983 },
} satisfies ToolExample<
  DopplerRecedingFrequencyInput,
  DopplerRecedingFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/doppler-receding-frequency",
  title: "Doppler Receding Frequency",
  description:
    "Observed frequency from a source receding from a stationary listener through still air.",
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
    calculateDopplerRecedingFrequency({
      sourceHertz: input.sourceHertz as number,
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      sourceSpeedMetersPerSecond: input.sourceSpeedMetersPerSecond as number,
    }),
});
export const dopplerRecedingFrequencyTool = tool;
export const runDopplerRecedingFrequency = tool.execute;
export default tool;
