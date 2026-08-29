import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const slipVsTimePredictableCheckerExample = {
  input: { intervalYears: 100, lastSlipM: 1, loadingRateMPerYr: 0.01 },
  output: { predictedSlipM: 1, modelAgrees: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const slipVsTimePredictableCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ intervalYears, lastSlipM, loadingRateMPerYr }) => {
      const predictedSlipM = loadingRateMPerYr * intervalYears;
      return { predictedSlipM, modelAgrees: predictedSlipM >= lastSlipM };
    })(input as never) as Record<string, unknown>,
  description:
    "Check whether observed recurrence interval and slip are consistent with a loading-rate-driven recurrence model.",
  id: "seismology/slip-vs-time-predictable-checker",
  inputs: [
    {
      minimum: 0,
      description: "Recurrence interval.",
      id: "intervalYears",
      kind: "number",
      label: "T",
      unit: "yr",
    },
    {
      minimum: 0,
      description: "Previous slip.",
      id: "lastSlipM",
      kind: "number",
      label: "d_last",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Loading rate.",
      id: "loadingRateMPerYr",
      kind: "number",
      label: "ṡ",
      unit: "m/yr",
    },
  ],
  outputs: [
    {
      description: "Predicted slip.",
      id: "predictedSlipM",
      kind: "number",
      label: "d_pred",
      unit: "m",
    },
    {
      description: "Whether predicted slip meets or exceeds previous slip.",
      id: "modelAgrees",
      kind: "boolean",
      label: "Consistent",
    },
  ],
  title: "Slip vs Time Predictable Checker",
});
export const runSlipVsTimePredictableChecker =
  slipVsTimePredictableCheckerTool.execute;
export { slipVsTimePredictableCheckerExample as example };
export default slipVsTimePredictableCheckerTool;
