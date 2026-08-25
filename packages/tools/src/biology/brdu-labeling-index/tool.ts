import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const brduLabelingIndexExample = {
  input: { brduLabeledNuclei: 90, totalNuclei: 1200 },
} satisfies ToolExample<{
  readonly brduLabeledNuclei: number;
  readonly totalNuclei: number;
}>;

export const brduLabelingIndexTool = createSimpleTool({
  id: "biology/brdu-labeling-index",
  title: "BrdU Labeling Index",
  description:
    "Compute the BrdU labeling index as the percentage of BrdU-labeled nuclei.",
  inputs: [
    {
      id: "brduLabeledNuclei",
      label: "BrdU-labeled nuclei",
      kind: "integer",
      minimum: 0,
    },
    { id: "totalNuclei", label: "Total nuclei", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "labelingIndexPercent",
      label: "Labeling index",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const brduLabeledNuclei = input.brduLabeledNuclei as number;
    const totalNuclei = input.totalNuclei as number;
    if (totalNuclei <= 0 || brduLabeledNuclei > totalNuclei)
      simpleError(
        "totalNuclei",
        "Total must be positive and labeled nuclei must not exceed it.",
        "invalid_counts",
      );
    return { labelingIndexPercent: (brduLabeledNuclei / totalNuclei) * 100 };
  },
});
export const runBrduLabelingIndex = brduLabelingIndexTool.execute;
export default brduLabelingIndexTool;
