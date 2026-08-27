import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BandwidthFromGainBandwidthInput = {
  readonly closedLoopGain: number;
  readonly gbpHz: number;
};

export type BandwidthFromGainBandwidthOutput = {
  readonly bandwidthHz: number;
};

export const bandwidthFromGainBandwidthExample = {
  input: { closedLoopGain: 100, gbpHz: 1000000 },
  output: { bandwidthHz: 10000 },
} satisfies ToolExample<
  BandwidthFromGainBandwidthInput,
  BandwidthFromGainBandwidthOutput
>;

export const calculateBandwidthFromGainBandwidth = (
  input: BandwidthFromGainBandwidthInput,
): BandwidthFromGainBandwidthOutput => {
  if (input.closedLoopGain === 0)
    simpleError(
      "closedLoopGain",
      "Closed-loop gain must not be zero.",
      "invalid_gain",
    );
  return { bandwidthHz: input.gbpHz / input.closedLoopGain };
};

export const bandwidthFromGainBandwidthTool = createSimpleTool({
  calculate: (input) =>
    calculateBandwidthFromGainBandwidth(
      input as unknown as BandwidthFromGainBandwidthInput,
    ),
  description: "Calculate bandwidth from a gain-bandwidth product.",
  id: "electronics/bandwidth-from-gain-bandwidth",
  inputs: [
    {
      id: "gbpHz",
      kind: "number",
      label: "Gain-bandwidth product",
      unit: "Hz",
    },
    { id: "closedLoopGain", kind: "number", label: "Closed-loop gain" },
  ],
  outputs: [
    { id: "bandwidthHz", kind: "number", label: "Bandwidth", unit: "Hz" },
  ],
  title: "Bandwidth From GBW",
});
export const runBandwidthFromGainBandwidth =
  bandwidthFromGainBandwidthTool.execute;
export default bandwidthFromGainBandwidthTool;
