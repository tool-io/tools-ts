import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AudioCompressorThresholdInput = Readonly<{
  readonly inputDb: number;
  readonly outputDb: number;
  readonly compressionRatio: number;
}>;
export type AudioCompressorThresholdOutput = Readonly<{
  readonly thresholdDb: number;
}>;

export const calculateAudioCompressorThreshold = (
  x: AudioCompressorThresholdInput,
): AudioCompressorThresholdOutput => {
  if (!Number.isFinite(x.inputDb))
    simpleError("inputDb", "Provide a finite number.");
  if (!Number.isFinite(x.outputDb))
    simpleError("outputDb", "Provide a finite number.");
  if (!Number.isFinite(x.compressionRatio) || x.compressionRatio < 0)
    simpleError("compressionRatio", "Provide a finite number at least 0.");
  if (
    x.compressionRatio <= 1 ||
    x.outputDb > x.inputDb ||
    (x.compressionRatio * x.outputDb - x.inputDb) / (x.compressionRatio - 1) >
      x.outputDb
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const thresholdDb =
    (x.compressionRatio * x.outputDb - x.inputDb) / (x.compressionRatio - 1);
  if (!Number.isFinite(thresholdDb))
    simpleError(
      "thresholdDb",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { thresholdDb: Object.is(thresholdDb, -0) ? 0 : thresholdDb };
};

export const example = {
  input: { inputDb: -10, outputDb: -15, compressionRatio: 2 },
  output: { thresholdDb: -20 },
} satisfies ToolExample<
  AudioCompressorThresholdInput,
  AudioCompressorThresholdOutput
>;

export const tool = createSimpleTool({
  id: "electronics/audio-compressor-threshold",
  title: "Audio Compressor Threshold",
  description:
    "Recover the static compressor threshold from one above-threshold input/output level pair and a known compression ratio R:1.",
  inputs: [
    { id: "inputDb", kind: "number", label: "Input Db", unit: "dB" },
    { id: "outputDb", kind: "number", label: "Output Db", unit: "dB" },
    {
      id: "compressionRatio",
      kind: "number",
      label: "Compression Ratio",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "thresholdDb", kind: "number", label: "Threshold Db", unit: "dB" },
  ],
  calculate: (input) =>
    calculateAudioCompressorThreshold({
      inputDb: input.inputDb as number,
      outputDb: input.outputDb as number,
      compressionRatio: input.compressionRatio as number,
    }),
});
export const audioCompressorThresholdTool = tool;
export const runAudioCompressorThreshold = tool.execute;
export default tool;
