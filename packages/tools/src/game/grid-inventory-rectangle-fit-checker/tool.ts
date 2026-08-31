import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, grid } from "../shared.js";
export type Input = Readonly<{
  readonly occupiedCellBoard: readonly (readonly number[])[];
  readonly itemHeightCells: number;
  readonly itemWidthCells: number;
  readonly allowQuarterTurnRotation: boolean;
}>;
export type Output = Readonly<{
  readonly fittingPlacementsRowColumnHeightWidth: readonly (readonly number[])[];
  readonly anyPlacementFits: boolean;
}>;
const inputFields = [
  { id: "occupiedCellBoard", label: "Occupied cell board", kind: "matrix" },
  { id: "itemHeightCells", label: "Item height cells", kind: "number" },
  { id: "itemWidthCells", label: "Item width cells", kind: "number" },
  {
    id: "allowQuarterTurnRotation",
    label: "Allow quarter turn rotation",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const w = grid(input.occupiedCellBoard, [0, 1]),
    h = input.occupiedCellBoard.length;
  bounded(input.itemHeightCells, "height", 1, 32);
  bounded(input.itemWidthCells, "width", 1, 32);
  const dims = [[input.itemHeightCells, input.itemWidthCells]];
  if (
    input.allowQuarterTurnRotation &&
    input.itemHeightCells !== input.itemWidthCells
  )
    dims.push([input.itemWidthCells, input.itemHeightCells]);
  const placements: number[][] = [];
  for (const [ih, iw] of dims)
    for (let r = 0; r + ih <= h; r++)
      for (let c = 0; c + iw <= w; c++) {
        let clear = true;
        for (let y = r; y < r + ih; y++)
          for (let x = c; x < c + iw; x++)
            if (input.occupiedCellBoard[y][x]) clear = false;
        if (clear) placements.push([r, c, ih, iw]);
      }
  return {
    fittingPlacementsRowColumnHeightWidth: placements,
    anyPlacementFits: placements.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  occupiedCellBoard: [
    [0, 1],
    [0, 0],
  ],
  itemHeightCells: 1,
  itemWidthCells: 2,
  allowQuarterTurnRotation: true,
} satisfies Input;
export const exampleOutput = {
  fittingPlacementsRowColumnHeightWidth: [
    [1, 0, 1, 2],
    [0, 0, 2, 1],
  ],
  anyPlacementFits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/grid-inventory-rectangle-fit-checker",
  title: "Grid Inventory Rectangle Fit Check",
  description:
    "Enumerate actual empty axis-aligned rectangular inventory placements, with optional unique quarter-turn orientation and occupied cells; no repacking, T-shaped items or generic dimension-only fit alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittingPlacementsRowColumnHeightWidth",
      label: "Fitting placements row column height width",
      kind: "matrix",
    },
    { id: "anyPlacementFits", label: "Any placement fits", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      occupiedCellBoard:
        value.occupiedCellBoard as readonly (readonly number[])[],
      itemHeightCells: value.itemHeightCells as number,
      itemWidthCells: value.itemWidthCells as number,
      allowQuarterTurnRotation: value.allowQuarterTurnRotation as boolean,
    }),
});
export const run = tool.execute;
export default tool;
