import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EqualizerBoostDbInput = Readonly<{
  readonly highFrequencyGain: number;
  readonly referenceGain: number;
}>;
export type EqualizerBoostDbOutput = Readonly<{
  readonly boostDb: number;
}>;

export const calculateEqualizerBoostDb = (
  x: EqualizerBoostDbInput,
): EqualizerBoostDbOutput => {
  if (!Number.isFinite(x.highFrequencyGain) || x.highFrequencyGain < 0)
    simpleError("highFrequencyGain", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.referenceGain) || x.referenceGain < 0)
    simpleError("referenceGain", "Provide a finite number at least 0.");
  if (!(x.highFrequencyGain > 0 && x.referenceGain > 0))
    simpleError("input", "Both gains must be positive.");
  const boostDb = 20 * Math.log10(x.highFrequencyGain / x.referenceGain);
  if (!Number.isFinite(boostDb))
    simpleError("boostDb", "The inputs produce an invalid result.");
  return { boostDb: Object.is(boostDb, -0) ? 0 : boostDb };
};

export const example = {
  input: { highFrequencyGain: 2, referenceGain: 1 },
  output: { boostDb: 6.020599913279624 },
} satisfies ToolExample<EqualizerBoostDbInput, EqualizerBoostDbOutput>;

export const tool = createSimpleTool({
  id: "electronics/equalizer-boost-db",
  title: "Equalizer Boost Db",
  description:
    "Convert an equalizer's high-frequency-to-reference voltage gain ratio to decibels; both gains must use the same amplitude convention.",
  inputs: [
    {
      id: "highFrequencyGain",
      kind: "number",
      label: "High-frequency voltage gain",
      minimum: 0,
    },
    {
      id: "referenceGain",
      kind: "number",
      label: "Reference voltage gain",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "boostDb",
      kind: "number",
      label: "High-frequency boost",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateEqualizerBoostDb({
      highFrequencyGain: input.highFrequencyGain as number,
      referenceGain: input.referenceGain as number,
    }),
});
export const equalizerBoostDbTool = tool;
export const runEqualizerBoostDb = tool.execute;
export default tool;
