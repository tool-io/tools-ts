// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDoubleStruckLetterInput = Readonly<Record<string, never>>;
export type RandomDoubleStruckLetterOutput = { readonly value: string };

const source = { values: ["𝔸", "𝔹", "ℂ", "𝔻", "𝔼", "𝔽", "𝔾", "ℍ", "𝕀", "𝕁", "𝕂", "𝕃", "𝕄", "ℕ", "𝕆", "ℙ", "ℚ", "ℝ", "𝕊", "𝕋", "𝕌", "𝕍", "𝕎", "𝕏", "𝕐", "ℤ", "𝕒", "𝕓", "𝕔", "𝕕", "𝕖", "𝕗", "𝕘", "𝕙", "𝕚", "𝕛", "𝕜", "𝕝", "𝕞", "𝕟", "𝕠", "𝕡", "𝕢", "𝕣", "𝕤", "𝕥", "𝕦", "𝕧", "𝕨", "𝕩", "𝕪", "𝕫"] } as const;

export const randomDoubleStruckLetterValueCount = 52;

export const calculateRandomDoubleStruckLetter = (
  random: RandomSource = Math.random,
): RandomDoubleStruckLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDoubleStruckLetterExample = { input: {} } satisfies ToolExample<
  RandomDoubleStruckLetterInput,
  RandomDoubleStruckLetterOutput
>;

export const randomDoubleStruckLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDoubleStruckLetter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one uppercase or lowercase mathematical double-struck letter from Unicode 18.0 using injected randomness, including the legacy Letterlike Symbols code points.",
  id: "random/double-struck-letter",
  inputs: [],
  outputs: [
    {
      format: "random/double-struck-letter",
      id: "value",
      kind: "string",
      label: "Random Double-Struck Letter",
    },
  ],
  title: "Random Double-Struck Letter Generator",
});

export const runRandomDoubleStruckLetter = randomDoubleStruckLetterTool.execute;
export default randomDoubleStruckLetterTool;
