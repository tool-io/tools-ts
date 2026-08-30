import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AudioCrossoverSlopeInput = Readonly<{
  readonly lowerFrequencyHz: number;
  readonly higherFrequencyHz: number;
  readonly gainAtLowerDb: number;
  readonly gainAtHigherDb: number;
}>;
export type AudioCrossoverSlopeOutput = Readonly<{
  readonly slopeDbPerOctave: number;
}>;

export const calculateAudioCrossoverSlope = (
  x: AudioCrossoverSlopeInput,
): AudioCrossoverSlopeOutput => {
  if (!Number.isFinite(x.lowerFrequencyHz) || x.lowerFrequencyHz < 0)
    simpleError("lowerFrequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.higherFrequencyHz) || x.higherFrequencyHz < 0)
    simpleError("higherFrequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.gainAtLowerDb))
    simpleError("gainAtLowerDb", "Provide a finite number.");
  if (!Number.isFinite(x.gainAtHigherDb))
    simpleError("gainAtHigherDb", "Provide a finite number.");
  if (!(x.lowerFrequencyHz > 0 && x.higherFrequencyHz > x.lowerFrequencyHz))
    simpleError(
      "input",
      "Higher frequency must exceed positive lower frequency.",
    );
  const slopeDbPerOctave =
    (x.gainAtHigherDb - x.gainAtLowerDb) /
    Math.log2(x.higherFrequencyHz / x.lowerFrequencyHz);
  if (!Number.isFinite(slopeDbPerOctave))
    simpleError("slopeDbPerOctave", "The inputs produce an invalid result.");
  return {
    slopeDbPerOctave: Object.is(slopeDbPerOctave, -0) ? 0 : slopeDbPerOctave,
  };
};

export const example = {
  input: {
    lowerFrequencyHz: 500,
    higherFrequencyHz: 1000,
    gainAtLowerDb: -3,
    gainAtHigherDb: -9,
  },
  output: { slopeDbPerOctave: -6 },
} satisfies ToolExample<AudioCrossoverSlopeInput, AudioCrossoverSlopeOutput>;

export const tool = createSimpleTool({
  id: "electronics/audio-crossover-slope",
  title: "Audio Crossover Slope",
  description:
    "Find signed filter attenuation slope in dB per octave between two measured frequencies; nonlinear transitions need more points.",
  inputs: [
    {
      id: "lowerFrequencyHz",
      kind: "number",
      label: "Lower frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "higherFrequencyHz",
      kind: "number",
      label: "Higher frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "gainAtLowerDb",
      kind: "number",
      label: "Gain at lower frequency",
      unit: "dB",
    },
    {
      id: "gainAtHigherDb",
      kind: "number",
      label: "Gain at higher frequency",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "slopeDbPerOctave",
      kind: "number",
      label: "Measured slope",
      unit: "dB/oct",
    },
  ],
  calculate: (input) =>
    calculateAudioCrossoverSlope({
      lowerFrequencyHz: input.lowerFrequencyHz as number,
      higherFrequencyHz: input.higherFrequencyHz as number,
      gainAtLowerDb: input.gainAtLowerDb as number,
      gainAtHigherDb: input.gainAtHigherDb as number,
    }),
});
export const audioCrossoverSlopeTool = tool;
export const runAudioCrossoverSlope = tool.execute;
export default tool;
