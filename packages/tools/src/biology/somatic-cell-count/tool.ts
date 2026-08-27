import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const somaticCellCountExample = {
  input: { somaticCellCountCellsMl: 200000 },
} satisfies ToolExample<{
  readonly somaticCellCountCellsMl: number;
}>;

export const somaticCellCountTool = createSimpleTool({
  id: "biology/somatic-cell-count",
  title: "SCC Linear Score",
  description:
    "Convert a dairy milk somatic cell count to the standard linear score LS = log2(SCC / 100,000) + 3.",
  inputs: [
    {
      id: "somaticCellCountCellsMl",
      label: "Somatic cell count cells/mL",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "somaticCellLinearScore",
      label: "Somatic cell linear score",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const somaticCellCountCellsMl = input.somaticCellCountCellsMl as number;
    if (somaticCellCountCellsMl <= 0)
      simpleError(
        "somaticCellCountCellsMl",
        "Somatic cell count must be greater than zero.",
      );
    return {
      somaticCellLinearScore: Math.log2(somaticCellCountCellsMl / 100000) + 3,
    };
  },
});
export const runSomaticCellCount = somaticCellCountTool.execute;
export default somaticCellCountTool;
