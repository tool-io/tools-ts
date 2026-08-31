import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, grid } from "../shared.js";
export type Input = Readonly<{
  readonly mineBoard: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly neighborMineCounts: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "mineBoard", label: "Mine board", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const w = grid(input.mineBoard, [0, 1]),
    h = input.mineBoard.length;
  return {
    neighborMineCounts: input.mineBoard.map((r, y) =>
      r.map((_, x) => {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++)
            if (
              (dy || dx) &&
              y + dy >= 0 &&
              y + dy < h &&
              x + dx >= 0 &&
              x + dx < w
            )
              n += input.mineBoard[y + dy][x + dx];
        return n;
      }),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  mineBoard: [
    [0, 1, 0],
    [0, 0, 0],
    [1, 0, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  neighborMineCounts: [
    [1, 0, 1],
    [2, 3, 2],
    [0, 2, 0],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/minesweeper-neighbor-mine-count-8-neighbors",
  title: "Minesweeper Neighbor Mine Count (8-Neighbors)",
  description:
    "Compute observed bounded Minesweeper eight-neighbor counts excluding the center, including counts at mine cells; no first-click generation, board inference or solver.",
  inputs: inputFields,
  outputs: [
    { id: "neighborMineCounts", label: "Neighbor mine counts", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({ mineBoard: value.mineBoard as readonly (readonly number[])[] }),
});
export const run = tool.execute;
export default tool;
