// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomChessPieceInput = Readonly<Record<string, never>>;
export type RandomChessPieceOutput = { readonly value: string };

const source = {
  ranges: [
    [0x2654, 0x265f],
    [0x1ccba, 0x1ccd1],
    [0x1fa00, 0x1fa57],
  ],
} as const;

export const randomChessPieceValueCount = 124;

export const calculateRandomChessPiece = (
  random: RandomSource = Math.random,
): RandomChessPieceOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomChessPieceExample = {
  input: {},
} satisfies ToolExample<RandomChessPieceInput, RandomChessPieceOutput>;

export const randomChessPieceTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomChessPiece(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Chess Piece using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/chess-piece",
  inputs: [],
  outputs: [
    {
      format: "random/chess-piece",
      id: "value",
      kind: "string",
      label: "Random Chess Piece",
    },
  ],
  title: "Random Chess Piece Generator",
});

export const runRandomChessPiece = randomChessPieceTool.execute;
export default randomChessPieceTool;
