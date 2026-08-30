import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AudioEqualizerQInput = Readonly<{
  readonly centerFrequencyHz: number;
  readonly lowerHalfPowerHz: number;
  readonly upperHalfPowerHz: number;
}>;
export type AudioEqualizerQOutput = Readonly<{
  readonly qualityFactor: number;
}>;

export const calculateAudioEqualizerQ = (
  x: AudioEqualizerQInput,
): AudioEqualizerQOutput => {
  if (!Number.isFinite(x.centerFrequencyHz) || x.centerFrequencyHz < 0)
    simpleError("centerFrequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lowerHalfPowerHz) || x.lowerHalfPowerHz < 0)
    simpleError("lowerHalfPowerHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.upperHalfPowerHz) || x.upperHalfPowerHz < 0)
    simpleError("upperHalfPowerHz", "Provide a finite number at least 0.");
  if (!(
    x.centerFrequencyHz > 0 &&
    x.lowerHalfPowerHz < x.centerFrequencyHz &&
    x.upperHalfPowerHz > x.centerFrequencyHz
  ))
    simpleError(
      "input",
      "Half-power frequencies must bracket positive center frequency.",
    );
  const qualityFactor =
    x.centerFrequencyHz / (x.upperHalfPowerHz - x.lowerHalfPowerHz);
  if (!Number.isFinite(qualityFactor))
    simpleError("qualityFactor", "The inputs produce an invalid result.");
  return { qualityFactor: Object.is(qualityFactor, -0) ? 0 : qualityFactor };
};

export const example = {
  input: {
    centerFrequencyHz: 1000,
    lowerHalfPowerHz: 900,
    upperHalfPowerHz: 1100,
  },
  output: { qualityFactor: 5 },
} satisfies ToolExample<AudioEqualizerQInput, AudioEqualizerQOutput>;

export const tool = createSimpleTool({
  id: "electronics/audio-equalizer-q",
  title: "Audio Equalizer Q",
  description:
    "Calculate equalizer center-frequency Q from measured lower and upper half-power frequencies.",
  inputs: [
    {
      id: "centerFrequencyHz",
      kind: "number",
      label: "Center frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "lowerHalfPowerHz",
      kind: "number",
      label: "Lower half-power frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "upperHalfPowerHz",
      kind: "number",
      label: "Upper half-power frequency",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [{ id: "qualityFactor", kind: "number", label: "Equalizer Q" }],
  calculate: (input) =>
    calculateAudioEqualizerQ({
      centerFrequencyHz: input.centerFrequencyHz as number,
      lowerHalfPowerHz: input.lowerHalfPowerHz as number,
      upperHalfPowerHz: input.upperHalfPowerHz as number,
    }),
});
export const audioEqualizerQTool = tool;
export const runAudioEqualizerQ = tool.execute;
export default tool;
