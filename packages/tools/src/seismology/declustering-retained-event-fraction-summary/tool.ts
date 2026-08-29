import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const declusteringRetainedEventFractionSummaryExample = {
  input: { retainedCount: 700, removedCount: 300 },
  output: { retainedFraction: 0.7, band: "typical for active zones" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const declusteringRetainedEventFractionSummaryTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ retainedCount, removedCount }) => {
      const total = retainedCount + removedCount;
      if (total === 0)
        simpleError("retainedCount", "Provide at least one event.");
      const f = retainedCount / total;
      return {
        retainedFraction: f,
        band:
          f >= 0.6
            ? "typical for active zones"
            : f >= 0.4
              ? "cluster-heavy catalog"
              : "swarm-dominated",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Fraction of the catalog retained as Poissonian background after declustering.",
  id: "seismology/declustering-retained-event-fraction-summary",
  inputs: [
    {
      minimum: 0,
      description: "Background events kept.",
      id: "retainedCount",
      kind: "integer",
      label: "n_keep",
    },
    {
      minimum: 0,
      description: "Clustered events removed.",
      id: "removedCount",
      kind: "integer",
      label: "n_drop",
    },
  ],
  outputs: [
    {
      description: "Retained share of the original catalog.",
      id: "retainedFraction",
      kind: "number",
      label: "f",
    },
    {
      description: "Typical retention band.",
      id: "band",
      kind: "string",
      label: "Band",
    },
  ],
  title: "Declustering Retained Event Fraction Summary",
});
export const runDeclusteringRetainedEventFractionSummary =
  declusteringRetainedEventFractionSummaryTool.execute;
export { declusteringRetainedEventFractionSummaryExample as example };
export default declusteringRetainedEventFractionSummaryTool;
