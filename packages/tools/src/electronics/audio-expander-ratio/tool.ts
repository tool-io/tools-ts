import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AudioExpanderRatioInput = Readonly<{
  readonly inputChangeDb: number;
  readonly outputChangeDb: number;
}>;
export type AudioExpanderRatioOutput = Readonly<{
  readonly expansionRatio: number;
}>;

export const calculateAudioExpanderRatio = (
  x: AudioExpanderRatioInput,
): AudioExpanderRatioOutput => {
  if (!Number.isFinite(x.inputChangeDb))
    simpleError("inputChangeDb", "Provide a finite number.");
  if (!Number.isFinite(x.outputChangeDb))
    simpleError("outputChangeDb", "Provide a finite number.");
  if (
    x.inputChangeDb >= 0 ||
    x.outputChangeDb >= 0 ||
    x.outputChangeDb / x.inputChangeDb < 1
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const expansionRatio = x.outputChangeDb / x.inputChangeDb;
  if (!Number.isFinite(expansionRatio))
    simpleError(
      "expansionRatio",
      "Inputs produce an undefined or non-finite result.",
    );
  return { expansionRatio: Object.is(expansionRatio, -0) ? 0 : expansionRatio };
};

export const example = {
  input: { inputChangeDb: -10, outputChangeDb: -20 },
  output: { expansionRatio: 2 },
} satisfies ToolExample<AudioExpanderRatioInput, AudioExpanderRatioOutput>;

export const tool = createSimpleTool({
  id: "electronics/audio-expander-ratio",
  title: "Audio Expander Ratio",
  description:
    "Audio expander ratio from input-level and output-level changes below threshold, both measured in dB.",
  inputs: [
    {
      id: "inputChangeDb",
      kind: "number",
      label: "Input Change Db",
      unit: "dB",
    },
    {
      id: "outputChangeDb",
      kind: "number",
      label: "Output Change Db",
      unit: "dB",
    },
  ],
  outputs: [{ id: "expansionRatio", kind: "number", label: "Expansion Ratio" }],
  calculate: (input) =>
    calculateAudioExpanderRatio({
      inputChangeDb: input.inputChangeDb as number,
      outputChangeDb: input.outputChangeDb as number,
    }),
});
export const audioExpanderRatioTool = tool;
export const runAudioExpanderRatio = tool.execute;
export default tool;
