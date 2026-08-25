import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const cellPassageNumberExample = {
  input: { initialPassage: 12, splits: 3 },
} satisfies ToolExample<{
  readonly initialPassage: number;
  readonly splits: number;
}>;

export const cellPassageNumberTool = createSimpleTool({
  id: "biology/cell-passage-number",
  title: "Passage Number",
  description:
    "Compute the current cell passage number from the initial passage and splits.",
  inputs: [
    {
      id: "initialPassage",
      label: "Initial passage",
      kind: "integer",
      minimum: 0,
    },
    { id: "splits", label: "Splits performed", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "currentPassageNumber",
      label: "Current passage number",
      kind: "integer",
    },
  ],
  calculate: (input) => ({
    currentPassageNumber:
      (input.initialPassage as number) + (input.splits as number),
  }),
});
export const runCellPassageNumber = cellPassageNumberTool.execute;
export default cellPassageNumberTool;
