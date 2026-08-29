import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const miningCollapseMagnitudeNormsLookupExample = {
  input: { eventMagnitudeMw: 3.1 },
  output: {
    collapseNorm: "notable event for this illustrative screen",
    evacuationAdvice:
      "apply the mine's site-specific response threshold and inspection protocol",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const miningCollapseMagnitudeNormsLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eventMagnitudeMw }) => {
      if (eventMagnitudeMw >= 4)
        return {
          collapseNorm: "large event for this illustrative screen",
          evacuationAdvice:
            "follow the mine's approved emergency and geotechnical review protocol",
        };
      if (eventMagnitudeMw >= 2.5)
        return {
          collapseNorm: "notable event for this illustrative screen",
          evacuationAdvice:
            "apply the mine's site-specific response threshold and inspection protocol",
        };
      return {
        collapseNorm: "smaller event for this illustrative screen",
        evacuationAdvice: "classify using the mine's calibrated local protocol",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Illustrative magnitude bands for mining-induced events. It does not identify the source mechanism or replace mine-specific safety, evacuation, and inspection thresholds.",
  id: "seismology/mining-collapse-magnitude-norms-lookup",
  inputs: [
    {
      description: "Observed event magnitude.",
      id: "eventMagnitudeMw",
      kind: "number",
      label: "M",
    },
  ],
  outputs: [
    {
      description: "Classification against mining norms.",
      id: "collapseNorm",
      kind: "string",
      label: "Norm",
    },
    {
      description: "Recommended operational response.",
      id: "evacuationAdvice",
      kind: "string",
      label: "Action",
    },
  ],
  title: "Mining Collapse Magnitude Norms Lookup",
});
export const runMiningCollapseMagnitudeNormsLookup =
  miningCollapseMagnitudeNormsLookupTool.execute;
export { miningCollapseMagnitudeNormsLookupExample as example };
export default miningCollapseMagnitudeNormsLookupTool;
