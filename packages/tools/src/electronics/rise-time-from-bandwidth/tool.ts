import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RiseTimeFromBandwidthInput = {
  readonly bandwidthMhz: number;
};

export type RiseTimeFromBandwidthOutput = {
  readonly riseTimeNs: number;
};

export const riseTimeFromBandwidthExample = {
  input: { bandwidthMhz: 70 },
  output: { riseTimeNs: 5 },
} satisfies ToolExample<
  RiseTimeFromBandwidthInput,
  RiseTimeFromBandwidthOutput
>;

export const calculateRiseTimeFromBandwidth = (
  input: RiseTimeFromBandwidthInput,
): RiseTimeFromBandwidthOutput => {
  if (!(input.bandwidthMhz > 0))
    simpleError(
      "bandwidthMhz",
      "Bandwidth must be positive.",
      "invalid_bandwidth",
    );
  return { riseTimeNs: 350 / input.bandwidthMhz };
};

export const riseTimeFromBandwidthTool = createSimpleTool({
  calculate: (input) =>
    calculateRiseTimeFromBandwidth(
      input as unknown as RiseTimeFromBandwidthInput,
    ),
  description:
    "Compute the Gaussian response rise time as 350 / bandwidth in MHz giving nanoseconds.",
  id: "electronics/rise-time-from-bandwidth",
  inputs: [
    { id: "bandwidthMhz", kind: "number", label: "Bandwidth", unit: "MHz" },
  ],
  outputs: [
    { id: "riseTimeNs", kind: "number", label: "Rise time", unit: "ns" },
  ],
  title: "Rise Time From BW",
});
export const runRiseTimeFromBandwidth = riseTimeFromBandwidthTool.execute;
export default riseTimeFromBandwidthTool;
