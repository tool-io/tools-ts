import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PermutationTestInput = {
  readonly sampleA: readonly number[];
  readonly sampleB: readonly number[];
};

export type PermutationTestOutput = {
  readonly assignmentCount: number;
  readonly observedDifference: number;
  readonly pValue: number;
};

const DIFFERENCE_EPSILON = 1e-12;

/**
 * Exact two-sided permutation test on the difference of group means:
 * every distinct way of splitting the pooled sample into groups of the
 * original sizes is enumerated exhaustively (C(nA+nB, nA) label
 * assignments), so the result is fully deterministic with no randomness
 * or seeding. The p value is the fraction of assignments whose absolute
 * mean difference reaches the observed one.
 */
export const calculatePermutationTest = (
  input: PermutationTestInput,
): PermutationTestOutput => {
  const sampleA = input.sampleA;
  const sampleB = input.sampleB;
  if (sampleA.length === 0 || sampleB.length === 0)
    simpleError(
      "sampleA",
      "Both samples must contain at least one value.",
      "empty_sample",
    );
  if (sampleA.length > 8 || sampleB.length > 8)
    simpleError(
      "sampleA",
      "Each sample is limited to 8 values so every assignment can be enumerated.",
      "sample_too_large",
    );
  const sizeA = sampleA.length;
  const sizeB = sampleB.length;
  const pooled = [...sampleA, ...sampleB];
  const meanA = sampleA.reduce((sum, value) => sum + value, 0) / sizeA;
  const meanB = sampleB.reduce((sum, value) => sum + value, 0) / sizeB;
  const observedDifference = Math.abs(meanA - meanB);
  const totalSum = pooled.reduce((sum, value) => sum + value, 0);
  let assignmentCount = 0;
  let extremeCount = 0;
  const indices = Array.from({ length: sizeA }, (_, position) => position);
  for (;;) {
    let sumA = 0;
    for (const index of indices) sumA += pooled[index]!;
    assignmentCount += 1;
    const difference = Math.abs(sumA / sizeA - (totalSum - sumA) / sizeB);
    if (difference >= observedDifference - DIFFERENCE_EPSILON)
      extremeCount += 1;
    let cursor = sizeA - 1;
    while (cursor >= 0 && indices[cursor] === pooled.length - sizeA + cursor)
      cursor -= 1;
    if (cursor < 0) break;
    indices[cursor]! += 1;
    for (let follow = cursor + 1; follow < sizeA; follow += 1)
      indices[follow] = indices[follow - 1]! + 1;
  }
  return {
    assignmentCount,
    observedDifference: meanA - meanB,
    pValue: extremeCount / assignmentCount,
  };
};

export const permutationTestExample = {
  input: { sampleA: [1, 2, 3], sampleB: [4, 5, 6] },
  output: { assignmentCount: 20, observedDifference: -3, pValue: 0.1 },
} satisfies ToolExample<PermutationTestInput, PermutationTestOutput>;

export const permutationTestTool = createSimpleTool({
  id: "statistics/permutation-test",
  title: "Permutation Test Calculator",
  description:
    "Exact two-sided permutation test on the difference of two group means; all C(nA+nB, nA) group assignments of the pooled sample (each sample capped at 8 values) are enumerated deterministically.",
  inputs: [
    {
      description: "First sample values.",
      id: "sampleA",
      kind: "numberList",
      label: "Sample A",
      maximum: 8,
    },
    {
      description: "Second sample values.",
      id: "sampleB",
      kind: "numberList",
      label: "Sample B",
      maximum: 8,
    },
  ],
  outputs: [
    {
      description: "Observed mean(A) minus mean(B).",
      id: "observedDifference",
      kind: "number",
      label: "Observed difference",
    },
    {
      description: "Two-sided exact p value over all enumerated assignments.",
      id: "pValue",
      kind: "number",
      label: "p value",
    },
    {
      description: "Number of distinct label assignments C(nA+nB, nA).",
      id: "assignmentCount",
      kind: "integer",
      label: "Assignment count",
    },
  ],
  calculate: (input) =>
    calculatePermutationTest({
      sampleA: input.sampleA as readonly number[],
      sampleB: input.sampleB as readonly number[],
    }),
});

export const runPermutationTest = permutationTestTool.execute;
export default permutationTestTool;
