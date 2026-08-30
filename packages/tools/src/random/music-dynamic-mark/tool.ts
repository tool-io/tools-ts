// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMusicDynamicMarkInput = Readonly<Record<string, never>>;
export type RandomMusicDynamicMarkOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1d18c, 0x1d193],
    [0x1d265, 0x1d266],
  ],
} as const;

export const randomMusicDynamicMarkValueCount = 10;

export const calculateRandomMusicDynamicMark = (
  random: RandomSource = Math.random,
): RandomMusicDynamicMarkOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMusicDynamicMarkExample = {
  input: {},
} satisfies ToolExample<
  RandomMusicDynamicMarkInput,
  RandomMusicDynamicMarkOutput
>;

export const randomMusicDynamicMarkTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMusicDynamicMark(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Music Dynamic Mark using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/music-dynamic-mark",
  inputs: [],
  outputs: [
    {
      format: "random/music-dynamic-mark",
      id: "value",
      kind: "string",
      label: "Random Music Dynamic Mark",
    },
  ],
  title: "Random Music Dynamic Mark Generator",
});

export const runRandomMusicDynamicMark = randomMusicDynamicMarkTool.execute;
export default randomMusicDynamicMarkTool;
