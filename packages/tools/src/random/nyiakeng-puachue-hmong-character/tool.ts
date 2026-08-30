// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNyiakengPuachueHmongCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomNyiakengPuachueHmongCharacterOutput = {
  readonly value: string;
};

const source = {
  ranges: [
    [0x1e100, 0x1e12c],
    [0x1e130, 0x1e13d],
    [0x1e140, 0x1e149],
    [0x1e14e, 0x1e14f],
  ],
} as const;

export const randomNyiakengPuachueHmongCharacterValueCount = 71;

export const calculateRandomNyiakengPuachueHmongCharacter = (
  random: RandomSource = Math.random,
): RandomNyiakengPuachueHmongCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNyiakengPuachueHmongCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomNyiakengPuachueHmongCharacterInput,
  RandomNyiakengPuachueHmongCharacterOutput
>;

export const randomNyiakengPuachueHmongCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNyiakengPuachueHmongCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Nyiakeng Puachue Hmong Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/nyiakeng-puachue-hmong-character",
  inputs: [],
  outputs: [
    {
      format: "random/nyiakeng-puachue-hmong-character",
      id: "value",
      kind: "string",
      label: "Random Nyiakeng Puachue Hmong Character",
    },
  ],
  title: "Random Nyiakeng Puachue Hmong Character Generator",
});

export const runRandomNyiakengPuachueHmongCharacter =
  randomNyiakengPuachueHmongCharacterTool.execute;
export default randomNyiakengPuachueHmongCharacterTool;
