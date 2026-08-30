import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoardExpansionGapInput = Readonly<{
  readonly boardWidthMillimeters: number;
  readonly movementPerPercentMoisture: number;
  readonly moistureIncreasePercent: number;
}>;
export type BoardExpansionGapOutput = Readonly<{
  readonly totalGapMillimeters: number;
}>;

export const calculateBoardExpansionGap = (
  x: BoardExpansionGapInput,
): BoardExpansionGapOutput => {
  if (!Number.isFinite(x.boardWidthMillimeters) || x.boardWidthMillimeters < 0)
    simpleError("boardWidthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.movementPerPercentMoisture) ||
    x.movementPerPercentMoisture < 0
  )
    simpleError(
      "movementPerPercentMoisture",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.moistureIncreasePercent) ||
    x.moistureIncreasePercent < 0
  )
    simpleError(
      "moistureIncreasePercent",
      "Provide a finite number at least 0.",
    );
  const totalGapMillimeters =
    x.boardWidthMillimeters *
    x.movementPerPercentMoisture *
    x.moistureIncreasePercent;
  if (!Number.isFinite(totalGapMillimeters))
    simpleError(
      "totalGapMillimeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    totalGapMillimeters: Object.is(totalGapMillimeters, -0)
      ? 0
      : totalGapMillimeters,
  };
};

export const example = {
  input: {
    boardWidthMillimeters: 200,
    movementPerPercentMoisture: 0.002,
    moistureIncreasePercent: 3,
  },
  output: { totalGapMillimeters: 1.2000000000000002 },
} satisfies ToolExample<BoardExpansionGapInput, BoardExpansionGapOutput>;

export const tool = createSimpleTool({
  id: "carpentry/board-expansion-gap",
  title: "Board Expansion Gap",
  description:
    "Minimum total free space for expected across-grain board expansion from a supplied movement coefficient and moisture-content change.",
  inputs: [
    {
      id: "boardWidthMillimeters",
      kind: "number",
      label: "Board Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "movementPerPercentMoisture",
      kind: "number",
      label: "Movement Per Percent Moisture",
      unit: "1/%",
      minimum: 0,
    },
    {
      id: "moistureIncreasePercent",
      kind: "number",
      label: "Moisture Increase Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalGapMillimeters",
      kind: "number",
      label: "Total Gap Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateBoardExpansionGap({
      boardWidthMillimeters: input.boardWidthMillimeters as number,
      movementPerPercentMoisture: input.movementPerPercentMoisture as number,
      moistureIncreasePercent: input.moistureIncreasePercent as number,
    }),
});
export const boardExpansionGapTool = tool;
export const runBoardExpansionGap = tool.execute;
export default tool;
