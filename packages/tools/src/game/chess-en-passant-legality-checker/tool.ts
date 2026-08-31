import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, square, fen, epLegal } from "../shared.js";
export type Input = Readonly<{
  readonly positionFen: string;
  readonly fromSquare: string;
  readonly toSquare: string;
}>;
export type Output = Readonly<{ readonly legalImmediateEnPassant: boolean }>;
const inputFields = [
  { id: "positionFen", label: "Position fen", kind: "string" },
  { id: "fromSquare", label: "From square", kind: "string" },
  { id: "toSquare", label: "To square", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    legalImmediateEnPassant: epLegal(
      fen(input.positionFen),
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
  positionFen: "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1",
  fromSquare: "e5",
  toSquare: "d6",
} satisfies Input;
export const exampleOutput = { legalImmediateEnPassant: true } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-en-passant-legality-checker",
  title: "En Passant Legality Checker",
  description:
    "Check standard FEN immediate en-passant assertion, side/pawn geometry and resulting own-king safety including discovered checks; plausible FEN history is trusted, not fully reconstructed.",
  inputs: inputFields,
  outputs: [
    {
      id: "legalImmediateEnPassant",
      label: "Legal immediate en passant",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      positionFen: value.positionFen as string,
      fromSquare: value.fromSquare as string,
      toSquare: value.toSquare as string,
    }),
});
export const run = tool.execute;
export default tool;
