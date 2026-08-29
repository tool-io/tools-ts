import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const spectralRatioTwoStationQEstimateCalculatorExample = {
  input: { ratioSlopePerHz: -0.10471975511965977, lapseTimeDifferenceS: 10 },
  output: { codaQ: 300, qValid: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const spectralRatioTwoStationQEstimateCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ ratioSlopePerHz, lapseTimeDifferenceS }) => {
      if (lapseTimeDifferenceS <= 0)
        simpleError(
          "lapseTimeDifferenceS",
          "Lapse difference must be positive.",
        );
      if (ratioSlopePerHz >= 0)
        simpleError(
          "ratioSlopePerHz",
          "Attenuative ratios must decay with frequency.",
        );
      const q = (-Math.PI * lapseTimeDifferenceS) / ratioSlopePerHz;
      return { codaQ: q, qValid: q > 0 };
    })(input as never) as Record<string, unknown>,
  description:
    "Two-station coda Q from the log spectral-ratio slope: ln(A₁/A₂) = −π f Δt / Q.",
  id: "seismology/spectral-ratio-two-station-q-estimate-calculator",
  inputs: [
    {
      description: "Slope of ln(A₁/A₂) versus frequency.",
      id: "ratioSlopePerHz",
      kind: "number",
      label: "m",
      unit: "1/Hz",
    },
    {
      minimum: 0,
      description: "Lapse-time difference between stations.",
      id: "lapseTimeDifferenceS",
      kind: "number",
      label: "Δt",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Estimated coda quality factor.",
      id: "codaQ",
      kind: "number",
      label: "Q_c",
    },
    {
      description: "Whether the slope has the attenuation sign.",
      id: "qValid",
      kind: "boolean",
      label: "Valid?",
    },
  ],
  title: "Spectral Ratio Two Station Q Estimate Calculator",
});
export const runSpectralRatioTwoStationQEstimateCalculator =
  spectralRatioTwoStationQEstimateCalculatorTool.execute;
export { spectralRatioTwoStationQEstimateCalculatorExample as example };
export default spectralRatioTwoStationQEstimateCalculatorTool;
