import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, grid, square } from "../shared.js";
export type Input = Readonly<{
  readonly checkerBoard: readonly (readonly number[])[];
  readonly sideToMove: number;
}>;
export type Output = Readonly<{
  readonly availableSingleJumpMoves: readonly (readonly number[])[];
  readonly forcedCaptureExists: boolean;
  readonly ordinaryQuietMoveAllowed: boolean;
}>;
const inputFields = [
  { id: "checkerBoard", label: "Checker board", kind: "matrix" },
  { id: "sideToMove", label: "Side to move", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    grid(input.checkerBoard, [0, 1, -1, 2, -2], 8) !== 8 ||
    input.checkerBoard.length !== 8 ||
    ![1, -1].includes(input.sideToMove) ||
    input.checkerBoard.some((r, y) =>
      r.some((v, x) => v !== 0 && (x + y) % 2 !== 1),
    )
  )
    simpleError(
      "board",
      "8×8 dark-square American/English checkers board and side ±1 required.",
    );
  const jumps: number[][] = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = input.checkerBoard[r][c];
      if (Math.sign(p) !== input.sideToMove) continue;
      for (const dr of Math.abs(p) === 2 ? [-1, 1] : [input.sideToMove])
        for (const dc of [-1, 1]) {
          const y = r + 2 * dr,
            x = c + 2 * dc;
          if (
            y >= 0 &&
            y < 8 &&
            x >= 0 &&
            x < 8 &&
            Math.sign(input.checkerBoard[r + dr][c + dc]) ===
              -input.sideToMove &&
            input.checkerBoard[y][x] === 0
          )
            jumps.push([r, c, y, x]);
        }
    }
  return {
    availableSingleJumpMoves: jumps,
    forcedCaptureExists: jumps.length > 0,
    ordinaryQuietMoveAllowed: jumps.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  checkerBoard: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  sideToMove: 1,
} satisfies Input;
export const exampleOutput = {
  availableSingleJumpMoves: [[2, 1, 4, 3]],
  forcedCaptureExists: true,
  ordinaryQuietMoveAllowed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/checkers-forced-jump-rule-checker",
  title: "Checkers Forced Jump Rule Check",
  description:
    "Detect available mandatory single jumps for declared American/English short kings and forward-capturing men; quiet moves remain merely not barred by captures, not necessarily available. Chained jumps/promotion/other draughts variants omitted.",
  inputs: inputFields,
  outputs: [
    {
      id: "availableSingleJumpMoves",
      label: "Available single jump moves",
      kind: "matrix",
    },
    {
      id: "forcedCaptureExists",
      label: "Forced capture exists",
      kind: "boolean",
    },
    {
      id: "ordinaryQuietMoveAllowed",
      label: "Ordinary quiet move allowed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      checkerBoard: value.checkerBoard as readonly (readonly number[])[],
      sideToMove: value.sideToMove as number,
    }),
});
export const run = tool.execute;
export default tool;
