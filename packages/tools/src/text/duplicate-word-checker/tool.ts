import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DuplicateWordCheckerInput = {
  readonly text: string;
};

export type DuplicateWordCheckerOutput = {
  readonly hasDuplicates: boolean;
};

export const duplicateWordCheckerExample = {
  input: { text: "The quick brown fox jumps over the lazy dog" },
  output: { hasDuplicates: true },
} satisfies ToolExample<DuplicateWordCheckerInput, DuplicateWordCheckerOutput>;

export const duplicateWordCheckerTool = createSimpleTool({
  id: "text/duplicate-word-checker",
  title: "Duplicate Word Checker",
  description:
    "Check whether any whitespace-delimited word appears more than once, ignoring case.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "hasDuplicates", label: "Has duplicates result", kind: "boolean" },
  ],
  calculate: (input) => {
    const trimmed = (input.text as string).trim();
    if (trimmed === "") return { hasDuplicates: false };
    const words = trimmed.split(/\s+/u);
    const unique = new Set(words.map((word) => word.toLowerCase()));
    return { hasDuplicates: unique.size !== words.length };
  },
});
export const runDuplicateWordChecker = duplicateWordCheckerTool.execute;
export default duplicateWordCheckerTool;
