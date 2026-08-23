import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SentenceCaseInput = {
  readonly text?: string;
};

export type SentenceCaseOutput = {
  readonly sentenceCased: string;
};

export const calculateSentenceCase = (
  input: SentenceCaseInput,
): SentenceCaseOutput => {
  return {
    sentenceCased: (input.text ?? "hello WORLD. how ARE you?")
      .toLowerCase()
      .replace(/(^\s*[a-z])|([.!?]\s*[a-z])/g, (match) => match.toUpperCase()),
  };
};

export const sentenceCaseExample = {
  input: {
    text: "hello WORLD. how ARE you?",
  },
  output: {
    sentenceCased: "Hello world. How are you?",
  },
} satisfies ToolExample<SentenceCaseInput, SentenceCaseOutput>;

export const sentenceCaseTool = createSimpleTool({
  id: "text/sentence-case",
  title: "Sentence Case Converter",
  description:
    "Lowercase text and capitalize the first letter of each sentence ending with a period, exclamation mark or question mark.",
  inputs: [
    {
      description: "Text to convert.",
      default: "hello WORLD. how ARE you?",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Sentence-cased text.",
      id: "sentenceCased",
      kind: "string",
      label: "Sentence case",
    },
  ],
  calculate: (input) =>
    calculateSentenceCase({ text: input.text as string | undefined }),
});

export const runSentenceCase = sentenceCaseTool.execute;
export default sentenceCaseTool;
