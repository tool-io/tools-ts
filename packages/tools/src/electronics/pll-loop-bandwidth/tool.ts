import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PllLoopBandwidthInput = {
  readonly loopDivideInt: number;
  readonly referenceDividerForBandwidth?: number;
  readonly referenceFreqHz: number;
};

export type PllLoopBandwidthOutput = {
  readonly loopBandwidthHz: number;
};

export const pllLoopBandwidthExample = {
  input: { loopDivideInt: 72, referenceFreqHz: 10000000 },
  output: { loopBandwidthHz: 13888.888888888887 },
} satisfies ToolExample<PllLoopBandwidthInput, PllLoopBandwidthOutput>;

export const calculatePllLoopBandwidth = (
  input: PllLoopBandwidthInput,
): PllLoopBandwidthOutput => {
  if (!(input.referenceFreqHz > 0))
    simpleError(
      "referenceFreqHz",
      "Reference frequency must be positive.",
      "invalid_frequency",
    );
  if (!Number.isSafeInteger(input.loopDivideInt) || input.loopDivideInt < 1)
    simpleError(
      "loopDivideInt",
      "Loop divider must be an integer of at least one.",
      "invalid_divider",
    );
  const referenceDividerForBandwidth = input.referenceDividerForBandwidth ?? 10;
  if (
    !Number.isSafeInteger(referenceDividerForBandwidth) ||
    referenceDividerForBandwidth < 1
  )
    simpleError(
      "referenceDividerForBandwidth",
      "Reference divider must be an integer of at least one.",
      "invalid_divider",
    );
  return {
    loopBandwidthHz:
      input.referenceFreqHz /
      input.loopDivideInt /
      referenceDividerForBandwidth,
  };
};

export const pllLoopBandwidthTool = createSimpleTool({
  calculate: (input) =>
    calculatePllLoopBandwidth(input as unknown as PllLoopBandwidthInput),
  description:
    "Compute the phase-detector comparison frequency that sets the PLL loop bandwidth from the reference frequency, loop divider, and a documented reference divider (default ten).",
  id: "electronics/pll-loop-bandwidth",
  inputs: [
    {
      description: "Frequency of the reference oscillator.",
      format: "frequency",
      id: "referenceFreqHz",
      kind: "number",
      label: "Reference frequency",
      unit: "Hz",
    },
    {
      description: "Feedback divider ratio N.",
      id: "loopDivideInt",
      kind: "integer",
      label: "Loop divider",
      minimum: 1,
    },
    {
      default: 10,
      description:
        "Documented divisor applied to the comparison frequency to arrive at the usable loop bandwidth.",
      id: "referenceDividerForBandwidth",
      kind: "integer",
      label: "Bandwidth divisor",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Estimated closed-loop bandwidth.",
      format: "frequency",
      id: "loopBandwidthHz",
      kind: "number",
      label: "Loop bandwidth",
      unit: "Hz",
    },
  ],
  title: "PLL Loop Bandwidth",
});
export const runPllLoopBandwidth = pllLoopBandwidthTool.execute;
export default pllLoopBandwidthTool;
