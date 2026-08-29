import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const sourceSpectralFalloffHighFrequencySlopeCheckerExample = {
  input: { fittedDecayExponent: 1.8, tolerance: 0.5 },
  output: { matchesBruneGamma2: Math.abs(1.8 - 2) <= 0.5, deviation: 1.8 - 2 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const sourceSpectralFalloffHighFrequencySlopeCheckerTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ fittedDecayExponent, tolerance }) => {
        const dev = fittedDecayExponent - 2;
        return {
          matchesBruneGamma2: Math.abs(dev) <= tolerance,
          deviation: dev,
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Check whether a fitted high-frequency spectral decay matches the Brune γ=2 expectation.",
    id: "seismology/source-spectral-falloff-high-frequency-slope-checker",
    inputs: [
      {
        description: "Fitted power-law exponent.",
        id: "fittedDecayExponent",
        kind: "number",
        label: "γ_fit",
      },
      {
        default: 0.5,
        minimum: 0,
        description: "Acceptable deviation from two.",
        id: "tolerance",
        kind: "number",
        label: "±tol",
      },
    ],
    outputs: [
      {
        description: "Whether the fit is within tolerance of γ=2.",
        id: "matchesBruneGamma2",
        kind: "boolean",
        label: "Brune-like?",
      },
      {
        description: "Signed deviation from two.",
        id: "deviation",
        kind: "number",
        label: "Δγ",
      },
    ],
    title: "Source Spectral Falloff High Frequency Slope Checker",
  });
export const runSourceSpectralFalloffHighFrequencySlopeChecker =
  sourceSpectralFalloffHighFrequencySlopeCheckerTool.execute;
export { sourceSpectralFalloffHighFrequencySlopeCheckerExample as example };
export default sourceSpectralFalloffHighFrequencySlopeCheckerTool;
