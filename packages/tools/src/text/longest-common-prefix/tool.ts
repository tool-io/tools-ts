import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LongestCommonPrefixInput = {
  readonly strings: readonly string[];
};

export type LongestCommonPrefixOutput = {
  readonly prefix: string;
};

export const longestCommonPrefixExample = {
  input: { strings: ["interstellar", "interior", "internal"] },
  output: { prefix: "inter" },
} satisfies ToolExample<LongestCommonPrefixInput, LongestCommonPrefixOutput>;

export const calculateLongestCommonPrefix = (
  input: LongestCommonPrefixInput,
): LongestCommonPrefixOutput => {
  const strings = input.strings as readonly string[];
  if (strings.length === 0)
    simpleError(
      "strings",
      "Provide at least one string.",
      "insufficient_strings",
    );
  let prefix = strings[0]!;
  for (let index = 1; index < strings.length && prefix !== ""; index += 1) {
    const candidate = strings[index]!;
    let shared = 0;
    const limit = Math.min(prefix.length, candidate.length);
    while (
      shared < limit &&
      prefix[shared] === candidate[shared]
    )
      shared += 1;
    prefix = prefix.slice(0, shared);
  }
  return { prefix };
};

export const longestCommonPrefixTool = createSimpleTool({
  calculate: (input) =>
    calculateLongestCommonPrefix(
      input as unknown as LongestCommonPrefixInput,
    ),
  description: "Find the longest prefix shared by every provided string.",
  id: "text/longest-common-prefix",
  inputs: [
    {
      description: "Strings to compare.",
      id: "strings",
      kind: "stringList",
      label: "Strings",
    },
  ],
  outputs: [
    {
      description: "Longest common leading substring, empty when none.",
      id: "prefix",
      kind: "string",
      label: "Common prefix",
    },
  ],
  title: "Longest Common Prefix Tool",
});
export const runLongestCommonPrefix = longestCommonPrefixTool.execute;
export default longestCommonPrefixTool;
