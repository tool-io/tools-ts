import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MixerNoiseFigureInput = Readonly<{
  readonly inputSnrDb: number;
  readonly outputSnrDb: number;
}>;
export type MixerNoiseFigureOutput = Readonly<{
  readonly noiseFigureDb: number;
}>;

export const calculateMixerNoiseFigure = (
  x: MixerNoiseFigureInput,
): MixerNoiseFigureOutput => {
  if (!Number.isFinite(x.inputSnrDb))
    simpleError("inputSnrDb", "Provide a finite number.");
  if (!Number.isFinite(x.outputSnrDb))
    simpleError("outputSnrDb", "Provide a finite number.");
  if (x.inputSnrDb < x.outputSnrDb)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const noiseFigureDb = x.inputSnrDb - x.outputSnrDb;
  if (!Number.isFinite(noiseFigureDb))
    simpleError(
      "noiseFigureDb",
      "Inputs produce an undefined or non-finite result.",
    );
  return { noiseFigureDb: Object.is(noiseFigureDb, -0) ? 0 : noiseFigureDb };
};

export const example = {
  input: { inputSnrDb: 30, outputSnrDb: 20 },
  output: { noiseFigureDb: 10 },
} satisfies ToolExample<MixerNoiseFigureInput, MixerNoiseFigureOutput>;

export const tool = createSimpleTool({
  id: "electronics/mixer-noise-figure",
  title: "Mixer Noise Figure",
  description:
    "Mixer noise figure from input and output SNR measurements in decibels over equal bandwidth.",
  inputs: [
    { id: "inputSnrDb", kind: "number", label: "Input Snr Db", unit: "dB" },
    { id: "outputSnrDb", kind: "number", label: "Output Snr Db", unit: "dB" },
  ],
  outputs: [
    {
      id: "noiseFigureDb",
      kind: "number",
      label: "Noise Figure Db",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateMixerNoiseFigure({
      inputSnrDb: input.inputSnrDb as number,
      outputSnrDb: input.outputSnrDb as number,
    }),
});
export const mixerNoiseFigureTool = tool;
export const runMixerNoiseFigure = tool.execute;
export default tool;
