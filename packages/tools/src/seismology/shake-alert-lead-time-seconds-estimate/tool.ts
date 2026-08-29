import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const shakeAlertLeadTimeSecondsEstimateExample = {
  input: { epicentralDistanceKm: 60 },
  output: { leadTimeSeconds: 3.989247311827958, alertArrivedLate: false },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const shakeAlertLeadTimeSecondsEstimateTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ epicentralDistanceKm, vpKmS, vsKmS, processingLatencyS }) => {
      if (vsKmS <= 0 || vpKmS <= 0)
        simpleError("vpKmS", "Velocities must be positive.");
      if (vpKmS <= vsKmS)
        simpleError("vpKmS", "P-wave velocity must exceed S-wave velocity.");
      if (processingLatencyS < 0)
        simpleError(
          "processingLatencyS",
          "Processing latency cannot be negative.",
        );
      const leadTimeSeconds =
        epicentralDistanceKm / vsKmS -
        epicentralDistanceKm / vpKmS -
        processingLatencyS;
      return { leadTimeSeconds, alertArrivedLate: leadTimeSeconds < 0 };
    })(input as never) as Record<string, unknown>,
  description:
    "EEW lead time at a target site: S arrival minus detection epoch (P travel plus processing latency).",
  id: "seismology/shake-alert-lead-time-seconds-estimate",
  inputs: [
    {
      minimum: 0,
      description: "Distance from epicenter to the alert site.",
      id: "epicentralDistanceKm",
      kind: "number",
      label: "R",
      unit: "km",
    },
    {
      default: 6.2,
      description: "P-wave speed.",
      id: "vpKmS",
      kind: "number",
      label: "V_p",
      unit: "km/s",
    },
    {
      default: 3.6,
      description: "S-wave speed.",
      id: "vsKmS",
      kind: "number",
      label: "V_s",
      unit: "km/s",
    },
    {
      default: 3,
      minimum: 0,
      description: "Detection/processing latency.",
      id: "processingLatencyS",
      kind: "number",
      label: "τ_proc",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Warning time before S-wave shaking.",
      id: "leadTimeSeconds",
      kind: "number",
      label: "Δt_alert",
      unit: "s",
    },
    {
      description: "Whether shaking precedes the alert.",
      id: "alertArrivedLate",
      kind: "boolean",
      label: "Late",
    },
  ],
  title: "Shake Alert Lead Time Seconds Estimate Calculator",
});
export const runShakeAlertLeadTimeSecondsEstimate =
  shakeAlertLeadTimeSecondsEstimateTool.execute;
export { shakeAlertLeadTimeSecondsEstimateExample as example };
export default shakeAlertLeadTimeSecondsEstimateTool;
