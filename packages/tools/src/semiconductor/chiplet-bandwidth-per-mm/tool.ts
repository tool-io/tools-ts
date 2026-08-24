import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChipletBandwidthPerMmInput = {
  readonly bitsPerTransfer?: number;
  readonly dataRateGTsPerTrace?: number;
  readonly tracesPerMm?: number;
};

export type ChipletBandwidthPerMmOutput = {
  readonly bandwidthTBsPerMm: number;
};

export const chipletBandwidthPerMmExample = {
  input: { bitsPerTransfer: 1, dataRateGTsPerTrace: 32, tracesPerMm: 100 },
  output: { bandwidthTBsPerMm: 0.4 },
} satisfies ToolExample<
  ChipletBandwidthPerMmInput,
  ChipletBandwidthPerMmOutput
>;

export const calculateChipletBandwidthPerMm = (
  input: ChipletBandwidthPerMmInput,
): ChipletBandwidthPerMmOutput => {
  const traces = input.tracesPerMm ?? 100;
  const rate = input.dataRateGTsPerTrace ?? 32;
  const bitsPerTransfer = input.bitsPerTransfer ?? 1;

  if (!Number.isFinite(traces) || traces <= 0)
    simpleError(
      "tracesPerMm",
      "Trace density must be a finite positive number.",
      "invalid_traces",
    );
  if (!Number.isFinite(rate) || rate <= 0)
    simpleError(
      "dataRateGTsPerTrace",
      "Per-trace data rate must be a finite positive number.",
      "invalid_data_rate",
    );
  if (!Number.isFinite(bitsPerTransfer) || bitsPerTransfer <= 0)
    simpleError(
      "bitsPerTransfer",
      "Bits per transfer must be a finite positive number.",
      "invalid_bits_per_transfer",
    );

  // GT/s measures transfers, not bytes. Convert Gbit/s to decimal TB/s.
  const directBandwidth = (traces * rate * bitsPerTransfer) / 8000;
  const bandwidthTBsPerMm =
    Number.isFinite(directBandwidth) && directBandwidth > 0
      ? directBandwidth
      : Math.exp(
          Math.log(traces) +
            Math.log(rate) +
            Math.log(bitsPerTransfer) -
            Math.log(8000),
        );
  if (!Number.isFinite(bandwidthTBsPerMm) || bandwidthTBsPerMm === 0)
    simpleError(
      "tracesPerMm",
      "Bandwidth density is outside the representable positive range.",
      bandwidthTBsPerMm === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return { bandwidthTBsPerMm: bandwidthTBsPerMm === 0 ? 0 : bandwidthTBsPerMm };
};

export const chipletBandwidthPerMmTool = createSimpleTool({
  calculate: (input) =>
    calculateChipletBandwidthPerMm({
      bitsPerTransfer:
        (input.bitsPerTransfer as number | undefined) ?? undefined,
      dataRateGTsPerTrace:
        (input.dataRateGTsPerTrace as number | undefined) ?? undefined,
      tracesPerMm: (input.tracesPerMm as number | undefined) ?? undefined,
    }),
  description:
    "Estimate raw die-to-die bandwidth density from trace density, transfer rate, and bits carried per transfer. Bandwidth = traces/mm × GT/s/trace × bits/transfer ÷ 8000 in decimal TB/s/mm; encoding and protocol overhead are not deducted.",
  id: "semiconductor/chiplet-bandwidth-per-mm",
  inputs: [
    {
      default: 1,
      description:
        "Payload bits represented by one transfer on one trace. Use 1 for a serial binary lane before encoding overhead.",
      id: "bitsPerTransfer",
      kind: "number",
      label: "Bits per transfer",
      minimum: Number.MIN_VALUE,
      unit: "bit/transfer",
    },
    {
      default: 32,
      description: "Per-trace data rate. Must be greater than 0 GT/s.",
      id: "dataRateGTsPerTrace",
      kind: "number",
      label: "Data rate per trace",
      minimum: Number.MIN_VALUE,
      unit: "GT/s",
    },
    {
      default: 100,
      description:
        "Number of traces per millimeter of die edge. Must be greater than 0 /mm.",
      id: "tracesPerMm",
      kind: "number",
      label: "Traces per millimeter",
      minimum: Number.MIN_VALUE,
      unit: "1/mm",
    },
  ],
  outputs: [
    {
      description:
        "Raw aggregate byte-bandwidth density before line coding and protocol overhead.",
      id: "bandwidthTBsPerMm",
      kind: "number",
      label: "Bandwidth density",
      minimum: Number.MIN_VALUE,
      unit: "TB/s/mm",
    },
  ],
  title: "Chiplet Bandwidth Density Calculator",
});
export const runChipletBandwidthPerMm = chipletBandwidthPerMmTool.execute;
export default chipletBandwidthPerMmTool;
