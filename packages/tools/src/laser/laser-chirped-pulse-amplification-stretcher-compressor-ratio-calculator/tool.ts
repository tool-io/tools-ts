import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CpaRatioInput = {
  readonly stretchedDurationPs: number;
  readonly compressedDurationFs: number;
};

export type CpaRatioOutput = {
  readonly stretchRatio: number;
  readonly stretchedDurationFs: number;
  readonly compressedDurationPs: number;
};

/**
 * Chirped-pulse amplification stretch factor: the ratio of the stretched
 * pulse duration to the compressed duration, S = τ_stretched / τ_compressed.
 */
export const cpaStretchRatio = (input: CpaRatioInput): CpaRatioOutput => {
  const { stretchedDurationPs, compressedDurationFs } = input;
  if (!Number.isFinite(stretchedDurationPs) || stretchedDurationPs <= 0)
    simpleError("stretchedDurationPs", "Stretched duration must be positive.");
  if (!Number.isFinite(compressedDurationFs) || compressedDurationFs <= 0)
    simpleError(
      "compressedDurationFs",
      "Compressed duration must be positive.",
    );
  const stretchedDurationFs = stretchedDurationPs * 1000;
  const compressedDurationPs = compressedDurationFs / 1000;
  const stretchRatio = stretchedDurationFs / compressedDurationFs;
  if (
    !Number.isFinite(stretchRatio) ||
    !Number.isFinite(stretchedDurationFs) ||
    !Number.isFinite(compressedDurationPs)
  )
    simpleError("stretchedDurationPs", "Stretch ratio overflowed.");
  return { stretchRatio, stretchedDurationFs, compressedDurationPs };
};

export const cpaRatioExample = {
  input: { stretchedDurationPs: 100, compressedDurationFs: 100 },
  output: {
    stretchRatio: 1000,
    stretchedDurationFs: 100000,
    compressedDurationPs: 0.1,
  },
} satisfies ToolExample<CpaRatioInput, CpaRatioOutput>;

export const cpaRatioTool = createSimpleTool({
  calculate: (input) =>
    cpaStretchRatio({
      compressedDurationFs: input.compressedDurationFs as number,
      stretchedDurationPs: input.stretchedDurationPs as number,
    }),
  description:
    "Compute the chirped-pulse amplification stretch factor from stretched and compressed pulse durations.",
  id: "laser/laser-chirped-pulse-amplification-stretcher-compressor-ratio-calculator",
  inputs: [
    {
      description: "Stretched pulse duration ahead of the amplifier.",
      id: "stretchedDurationPs",
      kind: "number",
      label: "Stretched duration",
      minimum: Number.MIN_VALUE,
      unit: "ps",
    },
    {
      description: "Compressed pulse duration after the compressor.",
      id: "compressedDurationFs",
      kind: "number",
      label: "Compressed duration",
      minimum: Number.MIN_VALUE,
      unit: "fs",
    },
  ],
  outputs: [
    {
      description: "Stretch factor τ_stretched / τ_compressed.",
      id: "stretchRatio",
      kind: "number",
      label: "Stretch ratio",
    },
    {
      description: "Stretched duration expressed in femtoseconds.",
      id: "stretchedDurationFs",
      kind: "number",
      label: "Stretched (fs)",
      unit: "fs",
    },
    {
      description: "Compressed duration expressed in picoseconds.",
      id: "compressedDurationPs",
      kind: "number",
      label: "Compressed (ps)",
      unit: "ps",
    },
  ],
  title: "CPA Stretch Ratio",
});
export const runCpaRatio = cpaRatioTool.execute;
export default cpaRatioTool;

export { cpaRatioExample as example };
