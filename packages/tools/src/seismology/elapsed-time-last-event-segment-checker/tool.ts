import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const elapsedTimeLastEventSegmentCheckerExample = {
  input: { lastEventYear: 1857, meanRecurrenceYears: 150, currentYear: 2026 },
  output: {
    elapsedYears: 169,
    loadingFraction: 1.1266666666666667,
    statusBand: "overdue window",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const elapsedTimeLastEventSegmentCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ lastEventYear, meanRecurrenceYears, currentYear }) => {
      if (meanRecurrenceYears <= 0)
        simpleError("meanRecurrenceYears", "Recurrence must be positive.");
      const elapsedYears = currentYear - lastEventYear;
      const frac = elapsedYears / meanRecurrenceYears;
      return {
        elapsedYears,
        loadingFraction: frac,
        statusBand:
          frac < 0.5
            ? "early cycle"
            : frac < 1
              ? "mid-to-late cycle"
              : "overdue window",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Compare elapsed time since the last segment rupture against the mean recurrence interval.",
  id: "seismology/elapsed-time-last-event-segment-checker",
  inputs: [
    {
      description: "Year of the most recent event.",
      id: "lastEventYear",
      kind: "number",
      label: "t_last",
    },
    {
      minimum: 0,
      description: "Mean recurrence interval.",
      id: "meanRecurrenceYears",
      kind: "number",
      label: "TR",
      unit: "yr",
    },
    {
      description: "Reference year for elapsed time.",
      id: "currentYear",
      kind: "number",
      label: "now",
    },
  ],
  outputs: [
    {
      description: "Years since the last event.",
      id: "elapsedYears",
      kind: "number",
      label: "te",
      unit: "yr",
    },
    {
      description: "Elapsed fraction of a mean cycle.",
      id: "loadingFraction",
      kind: "number",
      label: "te/TR",
    },
    {
      description: "Early/mid/late in the seismic cycle.",
      id: "statusBand",
      kind: "string",
      label: "Status",
    },
  ],
  title: "Elapsed Time Last Event Segment Checker",
});
export const runElapsedTimeLastEventSegmentChecker =
  elapsedTimeLastEventSegmentCheckerTool.execute;
export { elapsedTimeLastEventSegmentCheckerExample as example };
export default elapsedTimeLastEventSegmentCheckerTool;
