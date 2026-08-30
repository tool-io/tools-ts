import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuarterWaveResonatorLengthInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly frequencyHertz: number;
}>;
export type QuarterWaveResonatorLengthOutput = Readonly<{
  readonly lengthMeters: number;
}>;

export const calculateQuarterWaveResonatorLength = (
  x: QuarterWaveResonatorLengthInput,
): QuarterWaveResonatorLengthOutput => {
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
  const lengthMeters = x.soundSpeedMetersPerSecond / (4 * x.frequencyHertz);
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
  output: { lengthMeters: 0.8575 },
} satisfies ToolExample<
  QuarterWaveResonatorLengthInput,
  QuarterWaveResonatorLengthOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/quarter-wave-resonator-length",
  title: "Quarter Wave Resonator Length",
  description:
    "Ideal quarter-wave resonator length from sound speed and fundamental frequency, before end correction.",
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
    calculateQuarterWaveResonatorLength({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      frequencyHertz: input.frequencyHertz as number,
    }),
});
export const quarterWaveResonatorLengthTool = tool;
export const runQuarterWaveResonatorLength = tool.execute;
export default tool;
