import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcordanceDuplicateMergeDetectorInput = {
  readonly leftRefs: readonly string[];
  readonly rightRefs: readonly string[];
};

export type ConcordanceDuplicateMergeDetectorOutput = {
  readonly mergedDuplicates: readonly string[];
  readonly duplicateCount: number;
};

export const calculateConcordanceDuplicateMergeDetector = (
  input: ConcordanceDuplicateMergeDetectorInput,
): ConcordanceDuplicateMergeDetectorOutput => {
  const clean = (refs: readonly string[], field: string): readonly string[] =>
    refs.map((ref) => {
      const trimmed = ref.trim();
      if (!trimmed)
        return simpleError(
          field,
          "Reference entries must be non-empty strings.",
          "empty_entry",
        );
      return trimmed;
    });
  const left = clean(input.leftRefs, "leftRefs");
  const right = new Set(
    clean(input.rightRefs, "rightRefs").map((ref) => ref.toLowerCase()),
  );
  const mergedDuplicates: string[] = [];
  const seen = new Set<string>();
  for (const ref of left) {
    const key = ref.toLowerCase();
    if (right.has(key) && !seen.has(key)) {
      mergedDuplicates.push(ref);
      seen.add(key);
    }
  }
  return { mergedDuplicates, duplicateCount: mergedDuplicates.length };
};

export const concordanceDuplicateMergeDetectorExample = {
  input: {
    leftRefs: ["CIL VI 1527", "IG II² 1234"],
    rightRefs: [" cil vi 1527 ", "SEG 41, 785"],
  },
  output: { mergedDuplicates: ["CIL VI 1527"], duplicateCount: 1 },
} satisfies ToolExample<
  ConcordanceDuplicateMergeDetectorInput,
  ConcordanceDuplicateMergeDetectorOutput
>;

export const concordanceDuplicateMergeDetectorTool = createSimpleTool({
  id: "epigraphy/concordance-duplicate-merge-detector",
  title: "Concordance Cross-Reference Duplicate Merge Detector",
  description:
    "Detect cross-concordance duplicates by matching references between two lists case-insensitively after trimming whitespace and report merge candidates in first-listed order.",
  inputs: [
    {
      description: "References from the first concordance.",
      id: "leftRefs",
      kind: "stringList",
      label: "Left refs",
    },
    {
      description: "References from the second concordance.",
      id: "rightRefs",
      kind: "stringList",
      label: "Right refs",
    },
  ],
  outputs: [
    {
      description:
        "Left-list entries that also appear in the right list, in original casing and order.",
      id: "mergedDuplicates",
      kind: "stringList",
      label: "Merge candidates",
    },
    {
      description: "Number of unique merge candidates found.",
      id: "duplicateCount",
      kind: "integer",
      label: "Count",
    },
  ],
  calculate: (input) =>
    calculateConcordanceDuplicateMergeDetector(
      input as unknown as ConcordanceDuplicateMergeDetectorInput,
    ),
});

export const runConcordanceDuplicateMergeDetector =
  concordanceDuplicateMergeDetectorTool.execute;
export default concordanceDuplicateMergeDetectorTool;
