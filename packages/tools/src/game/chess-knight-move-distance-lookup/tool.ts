import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, square, knightDistance } from "../shared.js";
export type Input = Readonly<{
  readonly fromSquare: string;
  readonly toSquare: string;
}>;
export type Output = Readonly<{
  readonly minimumEmptyBoardKnightMoves: number;
}>;
const inputFields = [
  { id: "fromSquare", label: "From square", kind: "string" },
  { id: "toSquare", label: "To square", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    minimumEmptyBoardKnightMoves: knightDistance(
      square(input.fromSquare),
      square(input.toSquare),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fromSquare: "a1",
  toSquare: "h8",
} satisfies Input;
export const exampleOutput = {
  minimumEmptyBoardKnightMoves: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-knight-move-distance-lookup",
  title: "Knight Move Distance Lookup",
  description:
    "Compute exact breadth-first minimum knight moves on an empty bounded 8×8 board; no obstacles, checks or move-history legality.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumEmptyBoardKnightMoves",
      label: "Minimum empty board knight moves",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fromSquare: value.fromSquare as string,
      toSquare: value.toSquare as string,
    }),
});
export const run = tool.execute;
export default tool;
