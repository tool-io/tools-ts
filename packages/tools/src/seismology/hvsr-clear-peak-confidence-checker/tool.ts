import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const hvsrClearPeakConfidenceCheckerExample = {
  input: { peakToMedianRatio: 3.5, frequencyScatterPercent: 8 },
  output: { clearPeak: true, failedCriteria: [] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const hvsrClearPeakConfidenceCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ peakToMedianRatio, frequencyScatterPercent }) => {
      const failedCriteria: string[] = [];
      if (peakToMedianRatio < 2) failedCriteria.push("amplitude_prominence");
      if (frequencyScatterPercent > 15)
        failedCriteria.push("frequency_stability");
      return { clearPeak: failedCriteria.length === 0, failedCriteria };
    })(input as never) as Record<string, unknown>,
  description:
    "SESAME-style screening: amplitude prominence plus window-to-window frequency stability.",
  id: "seismology/hvsr-clear-peak-confidence-checker",
  inputs: [
    {
      minimum: 0,
      description: "Peak amplitude over low-frequency median.",
      id: "peakToMedianRatio",
      kind: "number",
      label: "A₀/Ā",
    },
    {
      minimum: 0,
      description: "Window scatter of peak frequency.",
      id: "frequencyScatterPercent",
      kind: "number",
      label: "σ_f%",
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Whether both SESAME-style criteria pass.",
      id: "clearPeak",
      kind: "boolean",
      label: "Clear",
    },
    {
      description: "Names of failed criteria.",
      id: "failedCriteria",
      kind: "stringList",
      label: "Failed",
    },
  ],
  title: "HVSR Clear Peak Confidence Checker",
});
export const runHvsrClearPeakConfidenceChecker =
  hvsrClearPeakConfidenceCheckerTool.execute;
export { hvsrClearPeakConfidenceCheckerExample as example };
export default hvsrClearPeakConfidenceCheckerTool;
