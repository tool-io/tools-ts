import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReviewAnalyticalInput = {
  readonly expectations: ReadonlyArray<number>;
  readonly results: ReadonlyArray<number>;
  readonly tolerances: ReadonlyArray<number>;
};

export type ReviewAnalyticalOutput = {
  readonly absoluteDifferences: ReadonlyArray<number>;
  readonly exceptionCount: number;
  readonly exceptionIndices: ReadonlyArray<number>;
  readonly followUpRequired: boolean;
};

export const performReviewAnalyticalInquiry = (
  input: ReviewAnalyticalInput,
): ReviewAnalyticalOutput => {
  if (
    !Array.isArray(input.expectations) ||
    !Array.isArray(input.results) ||
    !Array.isArray(input.tolerances)
  )
    simpleError(
      "",
      "Expectations, results, and tolerances must be arrays.",
      "analytical_data_required",
    );
  if (
    input.expectations.length === 0 ||
    input.expectations.length !== input.results.length ||
    input.expectations.length !== input.tolerances.length
  )
    simpleError(
      "",
      "Each nonempty analytical expectation must have one result and tolerance.",
      "analytical_data_length_mismatch",
    );
  const absoluteDifferences: number[] = [];
  const exceptionIndices: number[] = [];
  for (const [index, expectation] of input.expectations.entries()) {
    const result = input.results[index]!;
    const tolerance = input.tolerances[index]!;
    for (const [field, value] of [
      [`expectations.${index}`, expectation],
      [`results.${index}`, result],
    ] as const)
      if (!Number.isFinite(value))
        simpleError(
          field,
          "Expectations and results must be finite.",
          "invalid_analytical_value",
        );
    if (!Number.isFinite(tolerance) || tolerance < 0)
      simpleError(
        `tolerances.${index}`,
        "Tolerances must be finite and nonnegative.",
        "invalid_analytical_tolerance",
      );
    const difference = Math.abs(result - expectation);
    if (!Number.isFinite(difference))
      simpleError(
        `results.${index}`,
        "The analytical difference is not finite.",
        "result_not_finite",
      );
    absoluteDifferences.push(difference);
    if (difference > tolerance) exceptionIndices.push(index);
  }
  return {
    absoluteDifferences,
    exceptionCount: exceptionIndices.length,
    exceptionIndices,
    followUpRequired: exceptionIndices.length > 0,
  };
};

export const reviewAnalyticalExample = {
  input: {
    expectations: [1000, 500, 200],
    results: [1020, 495, 240],
    tolerances: [25, 10, 25],
  },
  output: {
    absoluteDifferences: [20, 5, 40],
    exceptionCount: 1,
    exceptionIndices: [2],
    followUpRequired: true,
  },
} satisfies ToolExample<ReviewAnalyticalInput, ReviewAnalyticalOutput>;

export const reviewAnalyticalTool = createSimpleTool({
  calculate: (input) =>
    performReviewAnalyticalInquiry({
      expectations: input.expectations as number[],
      results: input.results as number[],
      tolerances: input.tolerances as number[],
    }),
  description:
    "Compare review-engagement analytical expectations with results and flag only differences greater than their supplied tolerances for follow-up inquiry.",
  id: "auditing/review-engagement-analytical-inquiry-standard-procedures-lookup",
  inputs: [
    {
      description: "Expected analytical values.",
      id: "expectations",
      kind: "numberList",
      label: "Expectations",
    },
    {
      description: "Observed analytical values in the same order.",
      id: "results",
      kind: "numberList",
      label: "Results",
    },
    {
      description: "Nonnegative absolute tolerance for each expectation.",
      id: "tolerances",
      kind: "numberList",
      label: "Tolerances",
    },
  ],
  outputs: [
    {
      id: "absoluteDifferences",
      kind: "numberList",
      label: "Absolute differences",
    },
    {
      id: "exceptionCount",
      kind: "integer",
      label: "Analytical exceptions",
      minimum: 0,
    },
    { id: "exceptionIndices", kind: "numberList", label: "Exception indices" },
    { id: "followUpRequired", kind: "boolean", label: "Follow-up required" },
  ],
  title: "Review Engagement Analytical Inquiry Standard Procedures Lookup",
});

export const runReviewAnalytical = reviewAnalyticalTool.execute;
export default reviewAnalyticalTool;
