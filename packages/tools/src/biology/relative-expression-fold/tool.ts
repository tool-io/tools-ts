import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const relativeExpressionFoldExample = {
  input: { ddCt: -2 },
} satisfies ToolExample<{ readonly ddCt: number }>;

export const relativeExpressionFoldTool = createSimpleTool({
  id: "biology/relative-expression-fold",
  title: "Relative Expression Fold",
  description:
    "Convert a delta delta CT value into a relative fold change using the 2^-ddCt method.",
  inputs: [
    { id: "ddCt", label: "Delta delta CT", kind: "number", unit: "cycles" },
  ],
  outputs: [
    {
      id: "relativeFoldChange",
      label: "Relative fold change",
      kind: "number",
      unit: "fold",
    },
  ],
  calculate: (input) => ({
    relativeFoldChange: Math.pow(2, -(input.ddCt as number)),
  }),
});
export const runRelativeExpressionFold = relativeExpressionFoldTool.execute;
export default relativeExpressionFoldTool;
