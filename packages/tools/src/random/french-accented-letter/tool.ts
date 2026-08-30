// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/fr.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomFrenchAccentedLetterInput = Readonly<Record<string, never>>;
export type RandomFrenchAccentedLetterOutput = { readonly value: string };

const source = { values: ["À", "Â", "Æ", "Ç", "É", "È", "Ê", "Ë", "Î", "Ï", "Ô", "Œ", "Ù", "Û", "Ü", "Ÿ"] } as const;

export const randomFrenchAccentedLetterValueCount = 16;

export const calculateRandomFrenchAccentedLetter = (
  random: RandomSource = Math.random,
): RandomFrenchAccentedLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomFrenchAccentedLetterExample = { input: {} } satisfies ToolExample<
  RandomFrenchAccentedLetterInput,
  RandomFrenchAccentedLetterOutput
>;

export const randomFrenchAccentedLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomFrenchAccentedLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern French accented-letter alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/french-accented-letter",
  inputs: [],
  outputs: [
    {
      format: "random/french-accented-letter",
      id: "value",
      kind: "string",
      label: "Random French Accented Letter",
    },
  ],
  title: "Random French Accented Letter Generator",
});

export const runRandomFrenchAccentedLetter = randomFrenchAccentedLetterTool.execute;
export default randomFrenchAccentedLetterTool;
