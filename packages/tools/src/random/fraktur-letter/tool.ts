// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomFrakturLetterInput = Readonly<Record<string, never>>;
export type RandomFrakturLetterOutput = { readonly value: string };

const source = { values: ["𝔄", "𝔅", "ℭ", "𝔇", "𝔈", "𝔉", "𝔊", "ℌ", "ℑ", "𝔍", "𝔎", "𝔏", "𝔐", "𝔑", "𝔒", "𝔓", "𝔔", "ℜ", "𝔖", "𝔗", "𝔘", "𝔙", "𝔚", "𝔛", "𝔜", "ℨ", "𝔞", "𝔟", "𝔠", "𝔡", "𝔢", "𝔣", "𝔤", "𝔥", "𝔦", "𝔧", "𝔨", "𝔩", "𝔪", "𝔫", "𝔬", "𝔭", "𝔮", "𝔯", "𝔰", "𝔱", "𝔲", "𝔳", "𝔴", "𝔵", "𝔶", "𝔷"] } as const;

export const randomFrakturLetterValueCount = 52;

export const calculateRandomFrakturLetter = (
  random: RandomSource = Math.random,
): RandomFrakturLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomFrakturLetterExample = { input: {} } satisfies ToolExample<
  RandomFrakturLetterInput,
  RandomFrakturLetterOutput
>;

export const randomFrakturLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomFrakturLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one uppercase or lowercase mathematical Fraktur letter from Unicode 18.0 using injected randomness, including the legacy Letterlike Symbols code points.",
  id: "random/fraktur-letter",
  inputs: [],
  outputs: [
    {
      format: "random/fraktur-letter",
      id: "value",
      kind: "string",
      label: "Random Fraktur Letter",
    },
  ],
  title: "Random Fraktur Letter Generator",
});

export const runRandomFrakturLetter = randomFrakturLetterTool.execute;
export default randomFrakturLetterTool;
