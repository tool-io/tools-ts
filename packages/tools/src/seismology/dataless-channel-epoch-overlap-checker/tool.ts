import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const datalessChannelEpochOverlapCheckerExample = {
  input: {
    epochAStartYear: 1990,
    epochAEndYear: 2005,
    epochBStartYear: 2000,
    epochBEndYear: 2020,
  },
  output: { overlaps: true, overlapYears: 5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const datalessChannelEpochOverlapCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ epochAStartYear, epochAEndYear, epochBStartYear, epochBEndYear }) => {
      if (epochAEndYear < epochAStartYear || epochBEndYear < epochBStartYear)
        simpleError("epochAEndYear", "Epoch end precedes start.");
      const overlapYears =
        Math.min(epochAEndYear, epochBEndYear) -
        Math.max(epochAStartYear, epochBStartYear);
      return {
        overlaps: overlapYears > 0,
        overlapYears: Math.max(overlapYears, 0),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Detect whether two channel epochs overlap and quantify the overlap span.",
  id: "seismology/dataless-channel-epoch-overlap-checker",
  inputs: [
    {
      description: "Start of epoch A.",
      id: "epochAStartYear",
      kind: "number",
      label: "A₀",
    },
    {
      description: "End of epoch A.",
      id: "epochAEndYear",
      kind: "number",
      label: "A₁",
    },
    {
      description: "Start of epoch B.",
      id: "epochBStartYear",
      kind: "number",
      label: "B₀",
    },
    {
      description: "End of epoch B.",
      id: "epochBEndYear",
      kind: "number",
      label: "B₁",
    },
  ],
  outputs: [
    {
      description: "Whether the epochs share time.",
      id: "overlaps",
      kind: "boolean",
      label: "Overlap?",
    },
    {
      description: "Overlap length in years.",
      id: "overlapYears",
      kind: "number",
      label: "Δt",
      unit: "yr",
    },
  ],
  title: "Dataless Channel Epoch Overlap Checker",
});
export const runDatalessChannelEpochOverlapChecker =
  datalessChannelEpochOverlapCheckerTool.execute;
export { datalessChannelEpochOverlapCheckerExample as example };
export default datalessChannelEpochOverlapCheckerTool;
