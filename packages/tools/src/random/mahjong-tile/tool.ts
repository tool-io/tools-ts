// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMahjongTileInput = Readonly<Record<string, never>>;
export type RandomMahjongTileOutput = { readonly value: string };

const source = { ranges: [[0x1f000, 0x1f02b]] } as const;

export const randomMahjongTileValueCount = 44;

export const calculateRandomMahjongTile = (
  random: RandomSource = Math.random,
): RandomMahjongTileOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMahjongTileExample = {
  input: {},
} satisfies ToolExample<RandomMahjongTileInput, RandomMahjongTileOutput>;

export const randomMahjongTileTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMahjongTile(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Mahjong Tile using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/mahjong-tile",
  inputs: [],
  outputs: [
    {
      format: "random/mahjong-tile",
      id: "value",
      kind: "string",
      label: "Random Mahjong Tile",
    },
  ],
  title: "Random Mahjong Tile Generator",
});

export const runRandomMahjongTile = randomMahjongTileTool.execute;
export default randomMahjongTileTool;
