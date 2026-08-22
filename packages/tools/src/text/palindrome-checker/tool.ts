import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const normalize = (text: string): string =>
  text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");

export const palindromeCheckerTool = createSimpleTool({
  id: "text/palindrome-checker",
  title: "Palindrome Checker",
  description:
    "Check whether text reads the same forwards and backwards (case and non-alphanumeric characters ignored).",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "isPalindrome", label: "Palindrome result", kind: "boolean" },
  ],
  calculate: (input) => {
    const normalized = normalize(input.text as string);
    return {
      isPalindrome: normalized === [...normalized].reverse().join(""),
    };
  },
});
export const runPalindromeChecker = palindromeCheckerTool.execute;
export default palindromeCheckerTool;

export type PalindromeCheckerInput = {
  readonly text: string;
};

export type PalindromeCheckerOutput = {
  readonly isPalindrome: boolean;
};

export const palindromeCheckerExample = {
  input: {
    text: "example",
  },
  output: {
    isPalindrome: false,
  },
} satisfies ToolExample<PalindromeCheckerInput, PalindromeCheckerOutput>;
