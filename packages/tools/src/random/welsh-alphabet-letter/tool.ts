// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/cy.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomWelshAlphabetLetterInput = Readonly<Record<string, never>>;
export type RandomWelshAlphabetLetterOutput = { readonly value: string };

const source = { values: ["A", "B", "C", "Ch", "D", "Dd", "E", "F", "Ff", "G", "Ng", "H", "I", "L", "Ll", "M", "N", "O", "P", "Ph", "R", "Rh", "S", "T", "Th", "U", "W", "Y"] } as const;

export const randomWelshAlphabetLetterValueCount = 28;

export const calculateRandomWelshAlphabetLetter = (
  random: RandomSource = Math.random,
): RandomWelshAlphabetLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomWelshAlphabetLetterExample = { input: {} } satisfies ToolExample<
  RandomWelshAlphabetLetterInput,
  RandomWelshAlphabetLetterOutput
>;

export const randomWelshAlphabetLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomWelshAlphabetLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Welsh alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/welsh-alphabet-letter",
  inputs: [],
  outputs: [
    {
      format: "random/welsh-alphabet-letter",
      id: "value",
      kind: "string",
      label: "Random Welsh Alphabet Letter",
    },
  ],
  title: "Random Welsh Alphabet Letter Generator",
});

export const runRandomWelshAlphabetLetter = randomWelshAlphabetLetterTool.execute;
export default randomWelshAlphabetLetterTool;
