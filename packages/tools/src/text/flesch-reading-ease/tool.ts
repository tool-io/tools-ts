import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fleschReadingEaseExample = {
  input: { sentences: 5, syllables: 40, words: 25 },
  output: { score: 66.4 },
} satisfies ToolExample<FleschInput, FleschOutput>;

export const calculateFleschReadingEase = (
  input: FleschInput,
): FleschOutput => {
  for (const [field, value] of [
    ["sentences", input.sentences],
    ["syllables", input.syllables],
    ["words", input.words],
  ] as const)
    if (value <= 0)
      simpleError(field, `${field} must be positive.`, "invalid_input");
  return {
    score: Number(
      (
        206.835 -
        1.015 * (input.words / input.sentences) -
        84.6 * (input.syllables / input.words)
      ).toPrecision(12),
    ),
  };
};

export type FleschInput = {
  readonly sentences: number;
  readonly syllables: number;
  readonly words: number;
};
export type FleschOutput = { readonly score: number };

export const fleschReadingEaseTool = createSimpleTool({
  calculate: (input) =>
    calculateFleschReadingEase(input as unknown as FleschInput),
  description:
    "Compute the Flesch reading ease score from sentence, word, and syllable counts.",
  id: "text/flesch-reading-ease",
  inputs: [
    { id: "sentences", kind: "integer", label: "Sentences", minimum: 1 },
    { id: "syllables", kind: "integer", label: "Syllables", minimum: 1 },
    { id: "words", kind: "integer", label: "Words", minimum: 1 },
  ],
  outputs: [{ id: "score", kind: "number", label: "Reading ease score" }],
  title: "Flesch Reading Ease Calculator",
});
export const runFleschReadingEase = fleschReadingEaseTool.execute;
export default fleschReadingEaseTool;
