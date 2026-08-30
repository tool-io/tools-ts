// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMeeteiMayekCharacterInput = Readonly<Record<string, never>>;
export type RandomMeeteiMayekCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xaae0, 0xaaf6],
    [0xabc0, 0xabed],
    [0xabf0, 0xabf9],
  ],
} as const;

export const randomMeeteiMayekCharacterValueCount = 79;

export const calculateRandomMeeteiMayekCharacter = (
  random: RandomSource = Math.random,
): RandomMeeteiMayekCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMeeteiMayekCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMeeteiMayekCharacterInput,
  RandomMeeteiMayekCharacterOutput
>;

export const randomMeeteiMayekCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMeeteiMayekCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Meetei Mayek Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/meetei-mayek-character",
  inputs: [],
  outputs: [
    {
      format: "random/meetei-mayek-character",
      id: "value",
      kind: "string",
      label: "Random Meetei Mayek Character",
    },
  ],
  title: "Random Meetei Mayek Character Generator",
});

export const runRandomMeeteiMayekCharacter =
  randomMeeteiMayekCharacterTool.execute;
export default randomMeeteiMayekCharacterTool;
