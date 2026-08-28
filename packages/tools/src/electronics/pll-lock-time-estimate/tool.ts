import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PllLockTimeEstimateInput = {
  readonly loopBandwidthHz: number;
};

export type PllLockTimeEstimateOutput = {
  readonly pllLockTimeSeconds: number;
};

export const pllLockTimeEstimateExample = {
  input: { loopBandwidthHz: 2500 },
  output: { pllLockTimeSeconds: 0.00025464790894703254 },
} satisfies ToolExample<PllLockTimeEstimateInput, PllLockTimeEstimateOutput>;

export const calculatePllLockTimeEstimate = (
  input: PllLockTimeEstimateInput,
): PllLockTimeEstimateOutput => {
  if (!(input.loopBandwidthHz > 0))
    simpleError(
      "loopBandwidthHz",
      "Loop bandwidth must be positive.",
      "invalid_bandwidth",
    );
  return { pllLockTimeSeconds: 4 / (2 * Math.PI * input.loopBandwidthHz) };
};

export const pllLockTimeEstimateTool = createSimpleTool({
  calculate: (input) =>
    calculatePllLockTimeEstimate(input as unknown as PllLockTimeEstimateInput),
  description:
    "Estimate the settling time of a phase-locked loop using the documented rule that lock takes roughly four time constants of the natural frequency in radians per second (4 divided by two pi times the loop bandwidth in Hz).",
  id: "electronics/pll-lock-time-estimate",
  inputs: [
    {
      description: "Closed-loop bandwidth of the PLL.",
      format: "frequency",
      id: "loopBandwidthHz",
      kind: "number",
      label: "Loop bandwidth",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      description: "Estimated time to settle within the lock window.",
      format: "time",
      id: "pllLockTimeSeconds",
      kind: "number",
      label: "PLL lock time",
      unit: "s",
    },
  ],
  title: "PLL Lock Time",
});
export const runPllLockTimeEstimate = pllLockTimeEstimateTool.execute;
export default pllLockTimeEstimateTool;
