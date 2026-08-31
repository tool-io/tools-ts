import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, grid } from "../shared.js";
export type Input = Readonly<{
  readonly availableCellBoard: readonly (readonly number[])[];
  readonly shipLength: number;
  readonly selectedSearchParity: number;
}>;
export type Output = Readonly<{
  readonly paritySearchCells: readonly (readonly number[])[];
  readonly viableShipPlacementCount: number;
  readonly coveredViablePlacementCount: number;
  readonly allViablePlacementsCovered: boolean;
}>;
const inputFields = [
  { id: "availableCellBoard", label: "Available cell board", kind: "matrix" },
  { id: "shipLength", label: "Ship length", kind: "number" },
  {
    id: "selectedSearchParity",
    label: "Selected search parity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const w = grid(input.availableCellBoard, [0, 1]),
    h = input.availableCellBoard.length;
  bounded(input.shipLength, "shipLength", 1, 32);
  bounded(input.selectedSearchParity, "parity", 0, 1);
  const cells: number[][] = [];
  for (let r = 0; r < h; r++)
    for (let c = 0; c < w; c++)
      if (
        input.availableCellBoard[r][c] &&
        (r + c) % 2 === input.selectedSearchParity
      )
        cells.push([r, c]);
  let total = 0,
    covered = 0;
  for (let r = 0; r < h; r++)
    for (let c = 0; c < w; c++)
      for (const [dr, dc] of input.shipLength === 1
        ? [[0, 1]]
        : [
            [0, 1],
            [1, 0],
          ]) {
        const span = Array.from({ length: input.shipLength }, (_, i) => [
          r + i * dr,
          c + i * dc,
        ]);
        if (
          span.every(
            ([y, x]) => y < h && x < w && input.availableCellBoard[y][x] === 1,
          )
        ) {
          total++;
          if (span.some(([y, x]) => (y + x) % 2 === input.selectedSearchParity))
            covered++;
        }
      }
  return {
    paritySearchCells: cells,
    viableShipPlacementCount: total,
    coveredViablePlacementCount: covered,
    allViablePlacementsCovered: total > 0 && total === covered,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  availableCellBoard: [
    [1, 1, 1],
    [1, 1, 1],
  ],
  shipLength: 3,
  selectedSearchParity: 0,
} satisfies Input;
export const exampleOutput = {
  paritySearchCells: [
    [0, 0],
    [0, 2],
    [1, 1],
  ],
  viableShipPlacementCount: 2,
  coveredViablePlacementCount: 2,
  allViablePlacementsCovered: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/battleship-parity-placement-strategy-lookup",
  title: "Battleship Parity Placement Strategy",
  description:
    "Enumerate straight ship placements in declared currently available cells and audit actual parity search coverage; length-one ships need not be covered, no hidden-ship probability or optimal shot guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "paritySearchCells", label: "Parity search cells", kind: "matrix" },
    {
      id: "viableShipPlacementCount",
      label: "Viable ship placement count",
      kind: "number",
    },
    {
      id: "coveredViablePlacementCount",
      label: "Covered viable placement count",
      kind: "number",
    },
    {
      id: "allViablePlacementsCovered",
      label: "All viable placements covered",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      availableCellBoard:
        value.availableCellBoard as readonly (readonly number[])[],
      shipLength: value.shipLength as number,
      selectedSearchParity: value.selectedSearchParity as number,
    }),
});
export const run = tool.execute;
export default tool;
