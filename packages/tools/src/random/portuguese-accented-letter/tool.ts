// Repertoire source: https://github.com/unicode-org/cldr/blob/main/common/main/pt.xml
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPortugueseAccentedLetterInput = Readonly<Record<string, never>>;
export type RandomPortugueseAccentedLetterOutput = { readonly value: string };

const source = { values: ["Á", "À", "Â", "Ã", "Ç", "É", "Ê", "Í", "Ó", "Ô", "Õ", "Ú"] } as const;

export const randomPortugueseAccentedLetterValueCount = 12;

export const calculateRandomPortugueseAccentedLetter = (
  random: RandomSource = Math.random,
): RandomPortugueseAccentedLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPortugueseAccentedLetterExample = { input: {} } satisfies ToolExample<
  RandomPortugueseAccentedLetterInput,
  RandomPortugueseAccentedLetterOutput
>;

export const randomPortugueseAccentedLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPortugueseAccentedLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one item from the explicitly enumerated modern Portuguese accented-letter alphabet repertoire using injected randomness; multigraph letters remain one result.",
  id: "random/portuguese-accented-letter",
  inputs: [],
  outputs: [
    {
      format: "random/portuguese-accented-letter",
      id: "value",
      kind: "string",
      label: "Random Portuguese Accented Letter",
    },
  ],
  title: "Random Portuguese Accented Letter Generator",
});

export const runRandomPortugueseAccentedLetter = randomPortugueseAccentedLetterTool.execute;
export default randomPortugueseAccentedLetterTool;
