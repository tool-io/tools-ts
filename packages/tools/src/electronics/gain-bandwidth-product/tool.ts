import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GainBandwidthProductInput = {
  readonly bandwidthHz: number;
  readonly closedLoopGain: number;
};

export type GainBandwidthProductOutput = {
  readonly gainBandwidthProductHz: number;
};

export const gainBandwidthProductExample = {
  input: { bandwidthHz: 20000, closedLoopGain: 100 },
  output: { gainBandwidthProductHz: 2000000 },
} satisfies ToolExample<GainBandwidthProductInput, GainBandwidthProductOutput>;

export const calculateGainBandwidthProduct = (
  input: GainBandwidthProductInput,
): GainBandwidthProductOutput => {
  if (!(input.bandwidthHz > 0))
    simpleError(
      "bandwidthHz",
      "Bandwidth must be positive.",
      "invalid_bandwidth",
    );
  return {
    gainBandwidthProductHz: input.closedLoopGain * input.bandwidthHz,
  };
};

export const gainBandwidthProductTool = createSimpleTool({
  calculate: (input) =>
    calculateGainBandwidthProduct(
      input as unknown as GainBandwidthProductInput,
    ),
  description: "Calculate the gain-bandwidth product required for a design.",
  id: "electronics/gain-bandwidth-product",
  inputs: [
    {
      id: "closedLoopGain",
      kind: "number",
      label: "Closed-loop gain",
      minimum: 1,
    },
    { id: "bandwidthHz", kind: "number", label: "Bandwidth", unit: "Hz" },
  ],
  outputs: [
    {
      id: "gainBandwidthProductHz",
      kind: "number",
      label: "Gain-bandwidth product",
      unit: "Hz",
    },
  ],
  title: "GBW Required",
});
export const runGainBandwidthProduct = gainBandwidthProductTool.execute;
export default gainBandwidthProductTool;
