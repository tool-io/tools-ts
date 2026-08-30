import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HalfWaveResonatorLengthInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly frequencyHertz: number;
}>;
export type HalfWaveResonatorLengthOutput = Readonly<{
  readonly lengthMeters: number;
}>;

export const calculateHalfWaveResonatorLength = (
  x: HalfWaveResonatorLengthInput,
): HalfWaveResonatorLengthOutput => {
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite positive number.",
    );
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz <= 0)
    simpleError("frequencyHertz", "Provide a finite positive number.");
  const lengthMeters = x.soundSpeedMetersPerSecond / (2 * x.frequencyHertz);
  if (!Number.isFinite(lengthMeters))
    simpleError(
      "lengthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lengthMeters: Object.is(lengthMeters, -0) ? 0 : lengthMeters };
};

export const example = {
  input: {
    soundSpeedMetersPerSecond: 343,
    frequencyHertz: 100,
  },
  output: { lengthMeters: 1.715 },
} satisfies ToolExample<
  HalfWaveResonatorLengthInput,
  HalfWaveResonatorLengthOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/half-wave-resonator-length",
  title: "Half Wave Resonator Length",
  description:
    "Ideal half-wave resonator length from sound speed and fundamental frequency, before end correction.",
  inputs: [
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lengthMeters", kind: "number", label: "Length Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateHalfWaveResonatorLength({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      frequencyHertz: input.frequencyHertz as number,
    }),
});
export const halfWaveResonatorLengthTool = tool;
export const runHalfWaveResonatorLength = tool.execute;
export default tool;
