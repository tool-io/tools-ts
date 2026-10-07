import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correctWords: number;
  readonly presentedWords: number;
};
export type Output = {
  readonly correctFraction: number;
  readonly correctPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctWords: { type: "integer", minimum: 0 },
    presentedWords: { type: "integer", minimum: 1 },
  },
  required: ["correctWords", "presentedWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctFraction: { type: "number" },
    correctPercent: { type: "number" },
  },
  required: ["correctFraction", "correctPercent"],
} as const;
/** Describe an explicitly counted speech-test correct-word fraction without selecting a clinical test norm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correctWords, presentedWords } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(presentedWords) &&
        presentedWords >= 1 &&
        presentedWords <= Number.MAX_SAFE_INTEGER,
      "presentedWords",
    ),
      presentedWords);
    (H.domain(
      Number.isSafeInteger(correctWords) &&
        correctWords >= 0 &&
        correctWords <= presentedWords,
      "correctWords",
    ),
      correctWords);
    return {
      correctFraction: correctWords / presentedWords,
      correctPercent: (100 * correctWords) / presentedWords,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correctWords: 18, presentedWords: 20 },
  output: { correctFraction: 0.9, correctPercent: 90 },
} satisfies ToolExample<Input, Output>;
export const speechTestCorrectWordFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/speech-test-correct-word-fraction",
    title: "Speech Test Correct Word Fraction",
    description:
      "Describe an explicitly counted speech-test correct-word fraction without selecting a clinical test norm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctWords: { type: "integer", minimum: 0 },
        presentedWords: { type: "integer", minimum: 1 },
      },
      required: ["correctWords", "presentedWords"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctFraction: { type: "number" },
        correctPercent: { type: "number" },
      },
      required: ["correctFraction", "correctPercent"],
    },
    ports: {
      inputs: [
        {
          id: "correctWords",
          label: "Correct Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "presentedWords",
          label: "Presented Words",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "correctFraction",
          label: "Correct Fraction",
          valueType: { type: "number" },
        },
        {
          id: "correctPercent",
          label: "Correct Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechTestCorrectWordFractionTool.execute;
export default speechTestCorrectWordFractionTool;
