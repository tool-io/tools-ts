import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const networkClusterSingletonFractionQualityExample = {
  input: { singletonCount: 15, clusteredCount: 85 },
  output: { singletonFraction: 0.15, qualityBand: "well associated" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const networkClusterSingletonFractionQualityTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ singletonCount, clusteredCount }) => {
      const total = singletonCount + clusteredCount;
      if (total === 0)
        simpleError("singletonCount", "Provide at least one event.");
      const singletonFraction = singletonCount / total;
      return {
        singletonFraction,
        qualityBand:
          singletonFraction < 0.2
            ? "well associated"
            : singletonFraction < 0.5
              ? "partially associated"
              : "fragmented",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Cluster-analysis quality screen: fraction of unassociated singletons in a detected cluster set.",
  id: "seismology/network-cluster-singleton-fraction-quality",
  inputs: [
    {
      minimum: 0,
      description: "Unassociated events.",
      id: "singletonCount",
      kind: "integer",
      label: "n_sing",
    },
    {
      minimum: 0,
      description: "Events assigned to clusters.",
      id: "clusteredCount",
      kind: "integer",
      label: "n_clust",
    },
  ],
  outputs: [
    {
      description: "Singletons over total events.",
      id: "singletonFraction",
      kind: "number",
      label: "f_sing",
    },
    {
      description: "Association quality band.",
      id: "qualityBand",
      kind: "string",
      label: "Quality",
    },
  ],
  title: "Network Cluster Singleton Fraction Quality",
});
export const runNetworkClusterSingletonFractionQuality =
  networkClusterSingletonFractionQualityTool.execute;
export { networkClusterSingletonFractionQualityExample as example };
export default networkClusterSingletonFractionQualityTool;
