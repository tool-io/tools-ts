import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fen, castleLegal } from "../shared.js";
export type Input = Readonly<{
  readonly positionFen: string;
  readonly requestedCastlingSide: string;
}>;
export type Output = Readonly<{ readonly legalStandardCastling: boolean }>;
const inputFields = [
  { id: "positionFen", label: "Position fen", kind: "string" },
  {
    id: "requestedCastlingSide",
    label: "Requested castling side",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    legalStandardCastling: castleLegal(
      fen(input.positionFen),
      input.requestedCastlingSide,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  positionFen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
  requestedCastlingSide: "king",
} satisfies Input;
export const exampleOutput = { legalStandardCastling: true } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-castling-rights-checker",
  title: "Castling Rights Checker",
  description:
    "Check standard (not Chess960) castling rights/home pieces, empty path and current/transit/destination king attack against explicit FEN; complete game history is not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "legalStandardCastling",
      label: "Legal standard castling",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      positionFen: value.positionFen as string,
      requestedCastlingSide: value.requestedCastlingSide as string,
    }),
});
export const run = tool.execute;
export default tool;
