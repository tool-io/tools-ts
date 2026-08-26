import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const foldChangeExample = {
  input: { conditionMean: 16, controlMean: 2 },
} satisfies ToolExample<{
  readonly conditionMean: number;
  readonly controlMean: number;
}>;

export const foldChangeTool = createSimpleTool({
  id: "biology/fold-change",
  title: "Fold Change",
  description:
    "Compute the fold change between condition and control means with its log2 value.",
  inputs: [
    { id: "conditionMean", label: "Condition mean", kind: "number" },
    { id: "controlMean", label: "Control mean", kind: "number" },
  ],
  outputs: [
    { id: "foldChange", label: "Fold change", kind: "number" },
    { id: "log2FoldChange", label: "Log2 fold change", kind: "number" },
  ],
  calculate: (input) => {
    const conditionMean = input.conditionMean as number;
    const controlMean = input.controlMean as number;
    if (!(conditionMean > 0))
      simpleError(
        "conditionMean",
        "Condition mean must be greater than zero for a logarithmic fold change.",
        "invalid_condition",
      );
    if (!(controlMean > 0))
      simpleError(
        "controlMean",
        "Control mean must be greater than zero for a logarithmic fold change.",
        "invalid_control",
      );
    const foldChange = conditionMean / controlMean;
    return {
      foldChange,
      log2FoldChange: Math.log2(foldChange),
    };
  },
});
export const runFoldChange = foldChangeTool.execute;
export default foldChangeTool;
