import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const firstBreakSnrValidityFlaggerExample = {
  input: { snrDb: 14, thresholdDb: 10 },
  output: { pickValid: true, marginDb: 4 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const firstBreakSnrValidityFlaggerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ snrDb, thresholdDb }) => {
      const margin = snrDb - (thresholdDb ?? 10);
      return { pickValid: margin >= 0, marginDb: margin };
    })(input as never) as Record<string, unknown>,
  description:
    "Screen first-break picks against a minimum signal-to-noise ratio in decibels.",
  id: "seismology/first-break-snr-validity-flagger",
  inputs: [
    {
      description: "Signal-to-noise ratio of the pick.",
      id: "snrDb",
      kind: "number",
      label: "SNR",
      unit: "dB",
    },
    {
      default: 10,
      description: "Acceptance threshold.",
      id: "thresholdDb",
      kind: "number",
      label: "thr",
      unit: "dB",
    },
  ],
  outputs: [
    {
      description: "Whether the pick passes the screen.",
      id: "pickValid",
      kind: "boolean",
      label: "Valid?",
    },
    {
      description: "SNR margin over the threshold.",
      id: "marginDb",
      kind: "number",
      label: "margin",
      unit: "dB",
    },
  ],
  title: "First Break SNR Validity Flagger",
});
export const runFirstBreakSnrValidityFlagger =
  firstBreakSnrValidityFlaggerTool.execute;
export { firstBreakSnrValidityFlaggerExample as example };
export default firstBreakSnrValidityFlaggerTool;
