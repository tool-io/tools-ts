// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomIdeographicDescriptionCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomIdeographicDescriptionCharacterOutput = {
  readonly value: string;
};

const source = {
  ranges: [
    [0x2ff0, 0x2fff],
    [0x31ef, 0x31ef],
  ],
} as const;

export const randomIdeographicDescriptionCharacterValueCount = 17;

export const calculateRandomIdeographicDescriptionCharacter = (
  random: RandomSource = Math.random,
): RandomIdeographicDescriptionCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomIdeographicDescriptionCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomIdeographicDescriptionCharacterInput,
  RandomIdeographicDescriptionCharacterOutput
>;

export const randomIdeographicDescriptionCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomIdeographicDescriptionCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Ideographic Description Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ideographic-description-character",
  inputs: [],
  outputs: [
    {
      format: "random/ideographic-description-character",
      id: "value",
      kind: "string",
      label: "Random Ideographic Description Character",
    },
  ],
  title: "Random Ideographic Description Character Generator",
});

export const runRandomIdeographicDescriptionCharacter =
  randomIdeographicDescriptionCharacterTool.execute;
export default randomIdeographicDescriptionCharacterTool;
