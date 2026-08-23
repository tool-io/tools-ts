import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WordWrapInput = {
  readonly text?: string;
  readonly width?: number;
};

export type WordWrapOutput = {
  readonly wrappedText: string;
  readonly lineCount: number;
};

export const calculateWordWrap = (input: WordWrapInput): WordWrapOutput => {
  const width = input.width ?? 16;
  const words = (input.text ?? "The quick brown fox jumps over the lazy dog")
    .split(/\s+/)
    .filter(Boolean);
  const lines: string[] = [];
  for (const word of words) {
    const last = lines[lines.length - 1];
    if (last !== undefined && last.length + 1 + word.length <= width)
      lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  return { lineCount: lines.length, wrappedText: lines.join("\n") };
};

export const wordWrapExample = {
  input: {
    text: "The quick brown fox jumps over the lazy dog",
    width: 16,
  },
  output: {
    lineCount: 3,
    wrappedText: "The quick brown\nfox jumps over\nthe lazy dog",
  },
} satisfies ToolExample<WordWrapInput, WordWrapOutput>;

export const wordWrapTool = createSimpleTool({
  id: "text/word-wrap",
  title: "Word Wrap Formatter",
  description:
    "Greedy word wrap: break text into lines no wider than the limit, keeping words longer than the limit intact on their own lines.",
  inputs: [
    {
      description: "Text to wrap; words are split on whitespace.",
      default: "The quick brown fox jumps over the lazy dog",
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      description: "Maximum characters per line.",
      default: 16,
      id: "width",
      kind: "integer",
      label: "Width",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Wrapped text joined with newline characters.",
      id: "wrappedText",
      kind: "string",
      label: "Wrapped text",
    },
    {
      description: "Number of lines produced.",
      id: "lineCount",
      kind: "integer",
      label: "Line count",
    },
  ],
  calculate: (input) =>
    calculateWordWrap({
      text: input.text as string,
      width: input.width as number,
    }),
});

export const runWordWrap = wordWrapTool.execute;
export default wordWrapTool;
