// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDominoTileInput = Readonly<Record<string, never>>;
export type RandomDominoTileOutput = { readonly value: string };

const source = { ranges: [[0x1f030, 0x1f093]] } as const;

export const randomDominoTileValueCount = 100;

export const calculateRandomDominoTile = (
  random: RandomSource = Math.random,
): RandomDominoTileOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDominoTileExample = {
  input: {},
} satisfies ToolExample<RandomDominoTileInput, RandomDominoTileOutput>;

export const randomDominoTileTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDominoTile(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Domino Tile using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/domino-tile",
  inputs: [],
  outputs: [
    {
      format: "random/domino-tile",
      id: "value",
      kind: "string",
      label: "Random Domino Tile",
    },
  ],
  title: "Random Domino Tile Generator",
});

export const runRandomDominoTile = randomDominoTileTool.execute;
export default randomDominoTileTool;
