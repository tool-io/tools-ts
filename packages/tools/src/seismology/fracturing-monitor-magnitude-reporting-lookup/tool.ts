import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const fracturingMonitorMagnitudeReportingLookupExample = {
  input: { localMagnitudeML: 1.9 },
  output: {
    reportingClass: "notable (regulatory report)",
    trafficLightLevel: "orange",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const fracturingMonitorMagnitudeReportingLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ localMagnitudeML }) => {
      const trafficLightLevel =
        localMagnitudeML >= 2.5
          ? "red"
          : localMagnitudeML >= 1.7
            ? "orange"
            : localMagnitudeML >= 1.0
              ? "blue"
              : "green";
      const reportingClass =
        localMagnitudeML < 0
          ? "micro (catalog only)"
          : localMagnitudeML < 1.0
            ? "small (internal log)"
            : "notable (regulatory report)";
      return { reportingClass, trafficLightLevel };
    })(input as never) as Record<string, unknown>,
  description:
    "Illustrative local-magnitude bands for hydraulic-fracturing monitoring. Traffic-light thresholds are jurisdiction- and project-specific, so operational decisions must use the approved site protocol.",
  id: "seismology/fracturing-monitor-magnitude-reporting-lookup",
  inputs: [
    {
      description: "Reported local magnitude.",
      id: "localMagnitudeML",
      kind: "number",
      label: "M_L",
    },
  ],
  outputs: [
    {
      description: "Operational reporting class.",
      id: "reportingClass",
      kind: "string",
      label: "Class",
    },
    {
      description: "Traffic-light protocol level.",
      id: "trafficLightLevel",
      kind: "string",
      label: "TLP",
    },
  ],
  title: "Fracturing Monitor Magnitude Reporting Lookup",
});
export const runFracturingMonitorMagnitudeReportingLookup =
  fracturingMonitorMagnitudeReportingLookupTool.execute;
export { fracturingMonitorMagnitudeReportingLookupExample as example };
export default fracturingMonitorMagnitudeReportingLookupTool;
