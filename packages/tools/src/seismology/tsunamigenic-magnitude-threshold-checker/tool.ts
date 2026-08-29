import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const tsunamigenicMagnitudeThresholdCheckerExample = {
  input: { magnitudeMw: 7.2, isSubmarine: true },
  output: { tsunamigenicLikely: true, thresholdApplied: 6.5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tsunamigenicMagnitudeThresholdCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeMw, isSubmarine }) => {
      const thresholdApplied = isSubmarine ? 6.5 : 7.0;
      return {
        tsunamigenicLikely: magnitudeMw >= thresholdApplied && isSubmarine,
        thresholdApplied,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Screen whether an event magnitude exceeds common tsunamigenic thresholds for its setting.",
  id: "seismology/tsunamigenic-magnitude-threshold-checker",
  inputs: [
    {
      description: "Event magnitude.",
      id: "magnitudeMw",
      kind: "number",
      label: "M",
    },
    {
      description: "Whether the source lies under water.",
      id: "isSubmarine",
      kind: "boolean",
      label: "Offshore?",
    },
  ],
  outputs: [
    {
      description: "Whether a damaging tsunami is plausible.",
      id: "tsunamigenicLikely",
      kind: "boolean",
      label: "Likely",
    },
    {
      description: "Threshold used for the setting.",
      id: "thresholdApplied",
      kind: "number",
      label: "M_thr",
    },
  ],
  title: "Tsunamigenic Magnitude Threshold Checker",
});
export const runTsunamigenicMagnitudeThresholdChecker =
  tsunamigenicMagnitudeThresholdCheckerTool.execute;
export { tsunamigenicMagnitudeThresholdCheckerExample as example };
export default tsunamigenicMagnitudeThresholdCheckerTool;
