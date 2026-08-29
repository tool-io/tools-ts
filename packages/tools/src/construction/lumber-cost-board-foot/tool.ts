import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LumberCostBoardFootInput = Readonly<{
  readonly totalCost: number;
  readonly boardFeet: number;
}>;
export type LumberCostBoardFootOutput = Readonly<{ costPerBoardFoot: number }>;

export const calculateLumberCostBoardFoot = (
  i: LumberCostBoardFootInput,
): LumberCostBoardFootOutput => {
  const value = i.totalCost / i.boardFeet;
  if (!Number.isFinite(value))
    simpleError("costPerBoardFoot", "The inputs produce a non-finite result.");
  return { costPerBoardFoot: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { totalCost: 240, boardFeet: 80 },
  output: { costPerBoardFoot: 3 },
} satisfies ToolExample<LumberCostBoardFootInput, LumberCostBoardFootOutput>;

export const tool = createSimpleTool({
  id: "construction/lumber-cost-board-foot",
  title: "Lumber Cost Per Board Foot",
  description:
    "Calculate lumber price per board foot from total lumber cost and the board-foot quantity priced on the same nominal or actual dimension basis.",
  inputs: [
    { id: "totalCost", kind: "number", label: "Total Cost", minimum: 0 },
    {
      id: "boardFeet",
      kind: "number",
      label: "Board Feet",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "costPerBoardFoot", kind: "number", label: "Cost Per Board Foot" },
  ],
  calculate: (input) =>
    calculateLumberCostBoardFoot({
      totalCost: input.totalCost as number,
      boardFeet: input.boardFeet as number,
    }),
});
export const lumberCostBoardFootTool = tool;
export const runLumberCostBoardFoot = tool.execute;
export default tool;
