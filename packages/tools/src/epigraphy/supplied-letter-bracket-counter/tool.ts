import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SuppliedLetterBracketCounterInput = {
  readonly transcription: string;
};

export type SuppliedLetterBracketCounterOutput = {
  readonly bracketPairCount: number;
  readonly suppliedLetterCount: number;
};

export const calculateSuppliedLetterBracketCounter = (
  input: SuppliedLetterBracketCounterInput,
): SuppliedLetterBracketCounterOutput => {
  if (!input.transcription.trim())
    return simpleError(
      "transcription",
      "Transcription text is required.",
      "invalid_transcription",
    );
  let bracketPairCount = 0;
  let suppliedLetterCount = 0;
  let depth = 0;
  for (let index = 0; index < input.transcription.length; index += 1) {
    const ch = input.transcription[index];
    if (ch === "[") {
      depth += 1;
    } else if (ch === "]") {
      if (depth === 0)
        return simpleError(
          "transcription",
          `Closing bracket at position ${index} has no matching opening bracket.`,
          "unbalanced_brackets",
        );
      depth -= 1;
      bracketPairCount += 1;
    } else if (depth > 0 && /\p{L}/u.test(ch)) suppliedLetterCount += 1;
  }
  if (depth !== 0)
    return simpleError(
      "transcription",
      "One or more opening brackets have no matching closing bracket.",
      "unbalanced_brackets",
    );
  return { bracketPairCount, suppliedLetterCount };
};

export const suppliedLetterBracketCounterExample = {
  input: { transcription: "DI[S MA]NIBVS" },
  output: { bracketPairCount: 1, suppliedLetterCount: 3 },
} satisfies ToolExample<
  SuppliedLetterBracketCounterInput,
  SuppliedLetterBracketCounterOutput
>;

export const suppliedLetterBracketCounterTool = createSimpleTool({
  id: "epigraphy/supplied-letter-bracket-counter",
  title: "Supplied Letters Square Bracket Counter",
  description:
    "Count the letters an editor has restored inside square brackets of a Leiden transcription, tallying bracket pairs and every alphabetic character (Latin or Greek) found between brackets.",
  inputs: [
    {
      description: "Leiden transcription with editorial square brackets.",
      id: "transcription",
      kind: "string",
      label: "Transcription",
    },
  ],
  outputs: [
    {
      description: "Number of balanced square-bracket pairs.",
      id: "bracketPairCount",
      kind: "integer",
      label: "Bracket pairs",
    },
    {
      description: "Letters counted inside brackets.",
      id: "suppliedLetterCount",
      kind: "integer",
      label: "Supplied letters",
    },
  ],
  calculate: (input) =>
    calculateSuppliedLetterBracketCounter(
      input as unknown as SuppliedLetterBracketCounterInput,
    ),
});

export const runSuppliedLetterBracketCounter =
  suppliedLetterBracketCounterTool.execute;
export default suppliedLetterBracketCounterTool;
