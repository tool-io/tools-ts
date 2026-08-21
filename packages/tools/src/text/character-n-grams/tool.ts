import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { toolResourceLimits } from "../../core/limits.js";

export type CharacterNGramsInput = {
  readonly n?: number;
  readonly text: string;
};

export type CharacterNGramsOutput = {
  readonly grams: string[];
};

export const characterNGramsExample = {
  input: { n: 2, text: "hello" },
  output: { grams: ["he", "el", "ll", "lo"] },
} satisfies ToolExample<CharacterNGramsInput, CharacterNGramsOutput>;

export const calculateCharacterNGrams = (
  input: CharacterNGramsInput,
): CharacterNGramsOutput => {
  const text = input.text as string;
  const n = input.n ?? 3;
  if (n < 1 || !Number.isInteger(n))
    simpleError(
      "n",
      "The gram length must be a positive integer.",
      "invalid_n",
    );
  if (n > text.length)
    simpleError(
      "n",
      "The gram length cannot exceed the text length.",
      "n_exceeds_length",
    );
  const count = text.length - n + 1;
  if (count > toolResourceLimits.generatedValues)
    simpleError(
      "text",
      `The result would exceed ${toolResourceLimits.generatedValues.toLocaleString("en-US")} grams.`,
      "resource_limit_exceeded",
    );
  const grams: string[] = [];
  for (let index = 0; index < count; index += 1)
    grams.push(text.slice(index, index + n));
  return { grams };
};

export const characterNGramsTool = createSimpleTool({
  calculate: (input) =>
    calculateCharacterNGrams(input as unknown as CharacterNGramsInput),
  description:
    "Split text into overlapping character n-grams of a fixed length.",
  id: "text/character-n-grams",
  inputs: [
    {
      description: "Text to split into grams.",
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      default: 3,
      description: "Length of each gram.",
      id: "n",
      kind: "integer",
      label: "Gram length",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Overlapping grams in text order.",
      id: "grams",
      kind: "stringList",
      label: "Grams",
    },
  ],
  title: "Character N-Gram Generator",
});
export const runCharacterNGrams = characterNGramsTool.execute;
export default characterNGramsTool;
