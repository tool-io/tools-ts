import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AudioEqualizerCenterFrequencyInput = Readonly<{
  readonly lowerHertz: number;
  readonly upperHertz: number;
}>;
export type AudioEqualizerCenterFrequencyOutput = Readonly<{
  readonly centerHertz: number;
}>;

export const calculateAudioEqualizerCenterFrequency = (
  x: AudioEqualizerCenterFrequencyInput,
): AudioEqualizerCenterFrequencyOutput => {
  if (!Number.isFinite(x.lowerHertz) || x.lowerHertz < 0)
    simpleError("lowerHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.upperHertz) || x.upperHertz < 0)
    simpleError("upperHertz", "Provide a finite number at least 0.");
  if (x.upperHertz <= x.lowerHertz)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerHertz = Math.sqrt(x.lowerHertz * x.upperHertz);
  if (!Number.isFinite(centerHertz))
    simpleError(
      "centerHertz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { centerHertz: Object.is(centerHertz, -0) ? 0 : centerHertz };
};

export const example = {
  input: { lowerHertz: 100, upperHertz: 400 },
  output: { centerHertz: 200 },
} satisfies ToolExample<
  AudioEqualizerCenterFrequencyInput,
  AudioEqualizerCenterFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/audio-equalizer-center-frequency",
  title: "Audio Equalizer Center Frequency",
  description:
    "Geometric center frequency of a band bounded by lower and upper −3 dB frequencies.",
  inputs: [
    {
      id: "lowerHertz",
      kind: "number",
      label: "Lower Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "upperHertz",
      kind: "number",
      label: "Upper Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "centerHertz", kind: "number", label: "Center Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateAudioEqualizerCenterFrequency({
      lowerHertz: input.lowerHertz as number,
      upperHertz: input.upperHertz as number,
    }),
});
export const audioEqualizerCenterFrequencyTool = tool;
export const runAudioEqualizerCenterFrequency = tool.execute;
export default tool;
