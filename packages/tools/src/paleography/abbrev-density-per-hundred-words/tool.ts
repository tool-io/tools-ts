import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbbrevDensityPerHundredWordsInput = {
  readonly wordCount: number;
  readonly abbreviationCount: number;
};

export type AbbrevDensityPerHundredWordsOutput = {
  readonly abbreviationsPerHundredWords: number;
  readonly densityBand: "sparse" | "moderate" | "dense";
};

export const calculateAbbrevDensityPerHundredWords = (
  input: AbbrevDensityPerHundredWordsInput,
): AbbrevDensityPerHundredWordsOutput => {
  if (!(Number.isSafeInteger(input.wordCount) && input.wordCount >= 1))
    return simpleError(
      "wordCount",
      "Word count must be a positive integer.",
      "invalid_count",
    );
  if (!(
    Number.isSafeInteger(input.abbreviationCount) &&
    input.abbreviationCount >= 0
  ))
    return simpleError(
      "abbreviationCount",
      "Abbreviation count must be a non-negative integer.",
      "invalid_count",
    );
  const abbreviationsPerHundredWords =
    (input.abbreviationCount / input.wordCount) * 100;
  if (!Number.isFinite(abbreviationsPerHundredWords))
    return simpleError(
      "abbreviationCount",
      "The density is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    abbreviationsPerHundredWords,
    densityBand:
      abbreviationsPerHundredWords < 5
        ? "sparse"
        : abbreviationsPerHundredWords <= 15
          ? "moderate"
          : "dense",
  };
};

export const abbrevDensityPerHundredWordsExample = {
  input: { wordCount: 250, abbreviationCount: 32 },
  output: { abbreviationsPerHundredWords: 12.8, densityBand: "moderate" },
} satisfies ToolExample<
  AbbrevDensityPerHundredWordsInput,
  AbbrevDensityPerHundredWordsOutput
>;

export const abbrevDensityPerHundredWordsTool = createSimpleTool({
  id: "paleography/abbrev-density-per-hundred-words",
  title: "Abbreviation Density per Hundred Words",
  description:
    "Convert counted abbreviation marks into marks per hundred words and band the density by the stated rule: sparse below 5, moderate from 5 to 15, dense above 15 (university-book levels).",
  inputs: [
    {
      description: "Transcribed words in the sample.",
      id: "wordCount",
      kind: "integer",
      label: "Words",
      minimum: 1,
    },
    {
      description: "Abbreviation marks in the same sample.",
      id: "abbreviationCount",
      kind: "integer",
      label: "Abbreviations",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Abbreviation marks per hundred words.",
      id: "abbreviationsPerHundredWords",
      kind: "number",
      label: "Marks/100 words",
    },
    {
      description: "Density band from the stated thresholds.",
      id: "densityBand",
      enum: ["sparse", "moderate", "dense"],
      kind: "string",
      label: "Density band",
    },
  ],
  calculate: (input) =>
    calculateAbbrevDensityPerHundredWords({
      abbreviationCount: input.abbreviationCount as number,
      wordCount: input.wordCount as number,
    }),
});

export const runAbbrevDensityPerHundredWords =
  abbrevDensityPerHundredWordsTool.execute;
export default abbrevDensityPerHundredWordsTool;
