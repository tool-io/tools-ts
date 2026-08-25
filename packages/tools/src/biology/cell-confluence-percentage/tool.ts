import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CellConfluencePercentageInput = {
  readonly flaskAreaCm2: number;
  readonly occupiedAreaCm2: number;
};

export type CellConfluencePercentageOutput = {
  readonly confluencePercent: number;
};

export const cellConfluencePercentageExample = {
  input: { flaskAreaCm2: 25, occupiedAreaCm2: 4.5 },
  output: { confluencePercent: 18 },
} satisfies ToolExample<
  CellConfluencePercentageInput,
  CellConfluencePercentageOutput
>;

export const cellConfluencePercentageTool = createSimpleTool({
  id: "biology/cell-confluence-percentage",
  title: "Confluence %",
  description:
    "Compute the percentage of a culture vessel surface covered by cells from occupied and total flask areas.",
  inputs: [
    {
      id: "flaskAreaCm2",
      label: "Flask area",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "cm^2",
    },
    {
      id: "occupiedAreaCm2",
      label: "Occupied area",
      kind: "number",
      minimum: 0,
      unit: "cm^2",
    },
  ],
  outputs: [
    { id: "confluencePercent", label: "Confluence", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const flaskAreaCm2 = input.flaskAreaCm2 as number;
    const occupiedAreaCm2 = input.occupiedAreaCm2 as number;
    if (!(flaskAreaCm2 > 0))
      simpleError("flaskAreaCm2", "Flask area must be positive.");
    if (occupiedAreaCm2 < 0)
      simpleError("occupiedAreaCm2", "Occupied area cannot be negative.");
    if (occupiedAreaCm2 > flaskAreaCm2)
      simpleError(
        "occupiedAreaCm2",
        "Occupied area must not exceed flask area.",
      );
    return { confluencePercent: (occupiedAreaCm2 / flaskAreaCm2) * 100 };
  },
});
export const runCellConfluencePercentage = cellConfluencePercentageTool.execute;
export default cellConfluencePercentageTool;
