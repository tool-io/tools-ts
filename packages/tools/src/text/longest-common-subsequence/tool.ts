import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LongestCommonSubsequenceInput = {
  readonly first: string;
  readonly second: string;
};

export type LongestCommonSubsequenceOutput = {
  readonly length: number;
  readonly sequence: string;
};

export const calculateLongestCommonSubsequence = (
  input: LongestCommonSubsequenceInput,
): LongestCommonSubsequenceOutput => {
  const first = [...input.first];
  const second = [...input.second];
  if (first.length * second.length > 4_000_000)
    return simpleError(
      "first",
      "The combined string lengths exceed the dynamic-programming budget.",
      "resource_limit_exceeded",
    );
  const m = first.length;
  const n = second.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i += 1)
    for (let j = 1; j <= n; j += 1)
      dp[i]![j] =
        first[i - 1] === second[j - 1]
          ? dp[i - 1]![j - 1]! + 1
          : Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
  const characters: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (first[i - 1] === second[j - 1]) {
      characters.unshift(first[i - 1]!);
      i -= 1;
      j -= 1;
    } else if (dp[i - 1]![j]! >= dp[i]![j - 1]!) i -= 1;
    else j -= 1;
  }
  return { length: dp[m]![n]!, sequence: characters.join("") };
};

export const longestCommonSubsequenceExample = {
  input: {
    first: "ABCBDAB",
    second: "BDCABA",
  },
  output: {
    length: 4,
    sequence: "BCBA",
  },
} satisfies ToolExample<
  LongestCommonSubsequenceInput,
  LongestCommonSubsequenceOutput
>;

export const longestCommonSubsequenceTool = createSimpleTool({
  id: "text/longest-common-subsequence",
  title: "Longest Common Subsequence Finder",
  description:
    "Find one longest subsequence shared by two strings using dynamic programming.",
  inputs: [
    {
      description: "First text.",
      id: "first",
      kind: "string",
      label: "First string",
    },
    {
      description: "Second text.",
      id: "second",
      kind: "string",
      label: "Second string",
    },
  ],
  outputs: [
    {
      description: "Length of the longest common subsequence.",
      id: "length",
      kind: "integer",
      label: "Length",
    },
    {
      description:
        "One longest common subsequence; ties resolve toward the earliest backtrack path.",
      id: "sequence",
      kind: "string",
      label: "Subsequence",
    },
  ],
  calculate: (input) =>
    calculateLongestCommonSubsequence({
      first: input.first as string,
      second: input.second as string,
    }),
});

export const runLongestCommonSubsequence = longestCommonSubsequenceTool.execute;
export default longestCommonSubsequenceTool;
