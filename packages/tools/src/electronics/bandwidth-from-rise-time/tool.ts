import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BandwidthFromRiseTimeInput = {
  readonly riseTimeNs: number;
};

export type BandwidthFromRiseTimeOutput = {
  readonly bandwidthMhz: number;
};

export const bandwidthFromRiseTimeExample = {
  input: { riseTimeNs: 35 },
  output: { bandwidthMhz: 10 },
} satisfies ToolExample<
  BandwidthFromRiseTimeInput,
  BandwidthFromRiseTimeOutput
>;

export const calculateBandwidthFromRiseTime = (
  input: BandwidthFromRiseTimeInput,
): BandwidthFromRiseTimeOutput => {
  if (!(input.riseTimeNs > 0))
    simpleError(
      "riseTimeNs",
      "Rise time must be positive.",
      "invalid_rise_time",
    );
  return { bandwidthMhz: 350 / input.riseTimeNs };
};

export const bandwidthFromRiseTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateBandwidthFromRiseTime(
      input as unknown as BandwidthFromRiseTimeInput,
    ),
  description:
    "Compute the Gaussian rule bandwidth as 350 / rise time in nanoseconds giving MHz.",
  id: "electronics/bandwidth-from-rise-time",
  inputs: [
    { id: "riseTimeNs", kind: "number", label: "Rise time", unit: "ns" },
  ],
  outputs: [
    { id: "bandwidthMhz", kind: "number", label: "Bandwidth", unit: "MHz" },
  ],
  title: "BW From Rise Time",
});
export const runBandwidthFromRiseTime = bandwidthFromRiseTimeTool.execute;
export default bandwidthFromRiseTimeTool;
