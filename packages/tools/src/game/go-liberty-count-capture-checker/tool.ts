import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, grid, at } from "../shared.js";
export type Input = Readonly<{
  readonly goBoard: readonly (readonly number[])[];
  readonly selectedRow: number;
  readonly selectedColumn: number;
}>;
export type Output = Readonly<{
  readonly connectedGroupCells: readonly (readonly number[])[];
  readonly distinctLibertyCells: readonly (readonly number[])[];
  readonly libertyCount: number;
  readonly inAtari: boolean;
  readonly noLibertiesCaptureCandidate: boolean;
}>;
const inputFields = [
  { id: "goBoard", label: "Go board", kind: "matrix" },
  { id: "selectedRow", label: "Selected row", kind: "number" },
  { id: "selectedColumn", label: "Selected column", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const w = grid(input.goBoard, [0, 1, 2], 19),
    h = input.goBoard.length,
    color = at(input.goBoard, input.selectedRow, input.selectedColumn);
  if (color === 0)
    simpleError(
      "selection",
      "Select an observed stone, not an empty intersection.",
    );
  const start = input.selectedRow * w + input.selectedColumn,
    queue = [start],
    seen = new Set(queue),
    lib = new Set<number>();
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q],
      r = Math.floor(i / w),
      c = i % w;
    for (const [y, x] of [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ])
      if (y >= 0 && y < h && x >= 0 && x < w) {
        const j = y * w + x,
          v = input.goBoard[y][x];
        if (v === 0) lib.add(j);
        else if (v === color && !seen.has(j)) {
          seen.add(j);
          queue.push(j);
        }
      }
  }
  const coordinates = (v: Iterable<number>) =>
    [...v].sort((a, b) => a - b).map((i) => [Math.floor(i / w), i % w]);
  return {
    connectedGroupCells: coordinates(seen),
    distinctLibertyCells: coordinates(lib),
    libertyCount: lib.size,
    inAtari: lib.size === 1,
    noLibertiesCaptureCandidate: lib.size === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  goBoard: [
    [0, 2, 0],
    [2, 1, 0],
    [0, 0, 0],
  ],
  selectedRow: 1,
  selectedColumn: 1,
} satisfies Input;
export const exampleOutput = {
  connectedGroupCells: [[1, 1]],
  distinctLibertyCells: [
    [1, 2],
    [2, 1],
  ],
  libertyCount: 2,
  inAtari: false,
  noLibertiesCaptureCandidate: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/go-liberty-count-capture-checker",
  title: "Go Liberty Count Capture Check",
  description:
    "Compute orthogonally connected observed Go group and distinct liberties on up to 19×19 board; atari/capture candidates only, no move, suicide, ko/superko or full history legality.",
  inputs: inputFields,
  outputs: [
    {
      id: "connectedGroupCells",
      label: "Connected group cells",
      kind: "matrix",
    },
    {
      id: "distinctLibertyCells",
      label: "Distinct liberty cells",
      kind: "matrix",
    },
    { id: "libertyCount", label: "Liberty count", kind: "number" },
    { id: "inAtari", label: "In atari", kind: "boolean" },
    {
      id: "noLibertiesCaptureCandidate",
      label: "No liberties capture candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      goBoard: value.goBoard as readonly (readonly number[])[],
      selectedRow: value.selectedRow as number,
      selectedColumn: value.selectedColumn as number,
    }),
});
export const run = tool.execute;
export default tool;
