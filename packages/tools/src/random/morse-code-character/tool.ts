// Repertoire source: https://www.itu.int/rec/R-REC-M.1677-1-200910-I/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMorseCodeCharacterInput = Readonly<Record<string, never>>;
export type RandomMorseCodeCharacterOutput = { readonly value: string };

const source = {
  values: [
    "A ·−",
    "B −···",
    "C −·−·",
    "D −··",
    "E ·",
    "É ··−··",
    "F ··−·",
    "G −−·",
    "H ····",
    "I ··",
    "J ·−−−",
    "K −·−",
    "L ·−··",
    "M −−",
    "N −·",
    "O −−−",
    "P ·−−·",
    "Q −−·−",
    "R ·−·",
    "S ···",
    "T −",
    "U ··−",
    "V ···−",
    "W ·−−",
    "X −··−",
    "Y −·−−",
    "Z −−··",
    "0 −−−−−",
    "1 ·−−−−",
    "2 ··−−−",
    "3 ···−−",
    "4 ····−",
    "5 ·····",
    "6 −····",
    "7 −−···",
    "8 −−−··",
    "9 −−−−·",
    ". ·−·−·−",
    ", −−··−−",
    ": −−−···",
    "? ··−−··",
    "' ·−−−−·",
    "- −····−",
    "/ −··−·",
    "( −·−−·",
    ") −·−−·−",
    "Quotation mark ·−··−·",
    "= −···−",
    "Understood ···−·",
    "Error ········",
    "+ ·−·−·",
    "Invitation to transmit −·−",
    "Wait ·−···",
    "End of work ···−·−",
    "Starting signal −·−·−",
    "× −··−",
    "@ ·−−·−·",
  ],
} as const;

export const randomMorseCodeCharacterValueCount = 57;

export const calculateRandomMorseCodeCharacter = (
  random: RandomSource = Math.random,
): RandomMorseCodeCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMorseCodeCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMorseCodeCharacterInput,
  RandomMorseCodeCharacterOutput
>;

export const randomMorseCodeCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMorseCodeCharacter(
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
    "Choose one character or procedural signal from the complete ITU-R M.1677-1 International Morse code repertoire using injected randomness.",
  id: "random/morse-code-character",
  inputs: [],
  outputs: [
    {
      format: "random/morse-code-character",
      id: "value",
      kind: "string",
      label: "Random Morse Code Character",
    },
  ],
  title: "Random Morse Code Character Generator",
});

export const runRandomMorseCodeCharacter = randomMorseCodeCharacterTool.execute;
export default randomMorseCodeCharacterTool;
