import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const networkStationUptimePercentCalculatorExample = {
  input: { totalDays: 365, outageDays: 9 },
  output: { uptimePercent: 97.53424657534246, meetsTarget: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const networkStationUptimePercentCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ totalDays, outageDays }) => {
      if (outageDays > totalDays)
        simpleError("outageDays", "Outages cannot exceed the window.");
      const up = ((totalDays - outageDays) / totalDays) * 100;
      return { uptimePercent: up, meetsTarget: up >= 95 };
    })(input as never) as Record<string, unknown>,
  description: "Station uptime percentage from total and outage days.",
  id: "seismology/network-station-uptime-percent-calculator",
  inputs: [
    {
      minimum: 1,
      description: "Days in the reporting window.",
      id: "totalDays",
      kind: "integer",
      label: "T",
    },
    {
      minimum: 0,
      description: "Days with no usable data.",
      id: "outageDays",
      kind: "integer",
      label: "D_out",
    },
  ],
  outputs: [
    {
      description: "Uptime fraction in percent.",
      id: "uptimePercent",
      kind: "number",
      label: "%",
      unit: "%",
    },
    {
      description: "Whether uptime reaches the common 95 percent target.",
      id: "meetsTarget",
      kind: "boolean",
      label: "Meets 95%?",
    },
  ],
  title: "Network Station Uptime Percent Calculator",
});
export const runNetworkStationUptimePercentCalculator =
  networkStationUptimePercentCalculatorTool.execute;
export { networkStationUptimePercentCalculatorExample as example };
export default networkStationUptimePercentCalculatorTool;
