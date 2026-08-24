import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MissingLeafGapAnalyzerInput = {
  readonly expectedTotalLeaves: number;
  readonly presentLeafNumbers?: readonly number[];
};

export type MissingLeafGapAnalyzerOutput = {
  readonly missingLeafNumbers: number[];
  readonly missingCount: number;
  readonly gapSummary: string;
};

export const calculateMissingLeafGapAnalyzer = (
  input: MissingLeafGapAnalyzerInput,
): MissingLeafGapAnalyzerOutput => {
  if (
    !Number.isSafeInteger(input.expectedTotalLeaves) ||
    input.expectedTotalLeaves < 1 ||
    input.expectedTotalLeaves > toolResourceLimits.generatedValues
  )
    return simpleError(
      "expectedTotalLeaves",
      `Expected leaf total must be an integer from 1 to ${toolResourceLimits.generatedValues}.`,
      "invalid_collation",
    );
  const seen = new Set<number>();
  for (const leaf of input.presentLeafNumbers ?? []) {
    if (!Number.isInteger(leaf) || leaf < 1 || leaf > input.expectedTotalLeaves)
      return simpleError(
        "presentLeafNumbers",
        `Each present leaf must be a whole number between 1 and ${input.expectedTotalLeaves}.`,
        "invalid_list",
      );
    if (seen.has(leaf))
      return simpleError(
        "presentLeafNumbers",
        `Leaf ${leaf} is listed more than once.`,
        "invalid_list",
      );
    seen.add(leaf);
  }
  const missingLeafNumbers: number[] = [];
  for (let leaf = 1; leaf <= input.expectedTotalLeaves; leaf += 1)
    if (!seen.has(leaf)) missingLeafNumbers.push(leaf);
  const runs: string[] = [];
  let index = 0;
  while (index < missingLeafNumbers.length) {
    let end = index;
    while (
      end + 1 < missingLeafNumbers.length &&
      missingLeafNumbers[end + 1] === missingLeafNumbers[end] + 1
    )
      end += 1;
    const start = missingLeafNumbers[index]!;
    const stop = missingLeafNumbers[end]!;
    runs.push(start === stop ? `${start}` : `${start}-${stop}`);
    index = end + 1;
  }
  return {
    missingLeafNumbers,
    missingCount: missingLeafNumbers.length,
    gapSummary: runs.join(","),
  };
};

export const missingLeafGapAnalyzerExample = {
  input: { expectedTotalLeaves: 8, presentLeafNumbers: [8, 1, 5, 2, 6, 7] },
  output: { missingLeafNumbers: [3, 4], missingCount: 2, gapSummary: "3-4" },
} satisfies ToolExample<
  MissingLeafGapAnalyzerInput,
  MissingLeafGapAnalyzerOutput
>;

export const missingLeafGapAnalyzerTool = createSimpleTool({
  id: "paleography/missing-leaf-gap-analyzer",
  title: "Missing Leaf Gap Analyzer",
  description:
    "Compare surviving folio numbers against the expected quire total and report exactly which leaves are missing, how many, and their consecutive runs as a compact gap summary.",
  inputs: [
    {
      description: "Leaf count of the intact codex or quire.",
      id: "expectedTotalLeaves",
      kind: "integer",
      label: "Expected leaves",
      maximum: toolResourceLimits.generatedValues,
      minimum: 1,
    },
    {
      default: [],
      description: "Folio numbers still present (any order).",
      id: "presentLeafNumbers",
      kind: "numberList",
      label: "Present leaves",
    },
  ],
  outputs: [
    {
      description: "Sorted numbers of the missing leaves.",
      id: "missingLeafNumbers",
      kind: "numberList",
      label: "Missing leaves",
    },
    {
      description: "How many leaves are missing.",
      id: "missingCount",
      kind: "integer",
      label: "Missing count",
    },
    {
      description: "Comma-separated runs such as '3-4,7'.",
      id: "gapSummary",
      kind: "string",
      label: "Gap summary",
    },
  ],
  calculate: (input) =>
    calculateMissingLeafGapAnalyzer({
      expectedTotalLeaves: input.expectedTotalLeaves as number,
      presentLeafNumbers: input.presentLeafNumbers as readonly number[],
    }),
});

export const runMissingLeafGapAnalyzer = missingLeafGapAnalyzerTool.execute;
export default missingLeafGapAnalyzerTool;
