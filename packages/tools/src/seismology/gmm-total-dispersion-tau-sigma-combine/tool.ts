import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const gmmTotalDispersionTauSigmaCombineExample = {
  input: { betweenEventTau: 0.3, withinEventSigma: 0.6 },
  output: { totalSigma: 0.6708203932499369 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const gmmTotalDispersionTauSigmaCombineTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ betweenEventTau, withinEventSigma }) => ({
      totalSigma: Math.hypot(betweenEventTau, withinEventSigma),
    }))(input as never) as Record<string, unknown>,
  description: "Total GMM dispersion σ_T = √(τ² + σ²).",
  id: "seismology/gmm-total-dispersion-tau-sigma-combine",
  inputs: [
    {
      minimum: 0,
      description: "Between-event sigma.",
      id: "betweenEventTau",
      kind: "number",
      label: "τ",
    },
    {
      minimum: 0,
      description: "Within-event sigma.",
      id: "withinEventSigma",
      kind: "number",
      label: "σ",
    },
  ],
  outputs: [
    {
      description: "Total standard deviation.",
      id: "totalSigma",
      kind: "number",
      label: "σ_T",
    },
  ],
  title: "GMM Total Dispersion Tau Sigma Combine Calculator",
});
export const runGmmTotalDispersionTauSigmaCombine =
  gmmTotalDispersionTauSigmaCombineTool.execute;
export { gmmTotalDispersionTauSigmaCombineExample as example };
export default gmmTotalDispersionTauSigmaCombineTool;
