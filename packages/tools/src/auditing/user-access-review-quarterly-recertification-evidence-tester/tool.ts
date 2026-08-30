import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AccessRecertificationInput = {
  readonly maximumAgeDays: number;
  readonly reviews: ReadonlyArray<ReadonlyArray<number>>;
};

export type AccessRecertificationOutput = {
  readonly complete: boolean;
  readonly issueCount: number;
  readonly issueIndices: ReadonlyArray<number>;
  readonly reviewsChecked: number;
};

export const testAccessRecertificationEvidence = (
  input: AccessRecertificationInput,
): AccessRecertificationOutput => {
  if (!Number.isSafeInteger(input.maximumAgeDays) || input.maximumAgeDays < 0)
    simpleError(
      "maximumAgeDays",
      "The maximum review age must be a nonnegative whole number of days.",
      "invalid_maximum_age",
    );
  if (!Array.isArray(input.reviews))
    simpleError("reviews", "Reviews must be an array.", "reviews_required");
  const issueIndices: number[] = [];
  for (const [index, review] of input.reviews.entries()) {
    if (!Array.isArray(review) || review.length !== 4)
      simpleError(
        `reviews.${index}`,
        "Each review must contain age, reviewer, decision, and evidence flags.",
        "invalid_review_row",
      );
    const [ageDays, hasReviewer, hasDecision, hasEvidence] = review;
    if (!Number.isFinite(ageDays) || ageDays < 0)
      simpleError(
        `reviews.${index}.0`,
        "Review age must be finite and nonnegative.",
        "invalid_review_age",
      );
    for (const [column, value] of review.slice(1).entries())
      if (value !== 0 && value !== 1)
        simpleError(
          `reviews.${index}.${column + 1}`,
          "Reviewer, decision, and evidence fields must be 0 or 1.",
          "invalid_review_flag",
        );
    if (
      ageDays! > input.maximumAgeDays ||
      hasReviewer !== 1 ||
      hasDecision !== 1 ||
      hasEvidence !== 1
    )
      issueIndices.push(index);
  }
  return {
    complete: issueIndices.length === 0,
    issueCount: issueIndices.length,
    issueIndices,
    reviewsChecked: input.reviews.length,
  };
};

export const accessRecertificationExample = {
  input: {
    maximumAgeDays: 90,
    reviews: [
      [30, 1, 1, 1],
      [91, 1, 1, 1],
      [45, 1, 0, 1],
    ],
  },
  output: {
    complete: false,
    issueCount: 2,
    issueIndices: [1, 2],
    reviewsChecked: 3,
  },
} satisfies ToolExample<
  AccessRecertificationInput,
  AccessRecertificationOutput
>;

export const accessRecertificationTool = createSimpleTool({
  calculate: (input) =>
    testAccessRecertificationEvidence({
      maximumAgeDays: input.maximumAgeDays as number,
      reviews: input.reviews as number[][],
    }),
  description:
    "Flag user-access recertification rows that exceed a selected age or lack reviewer, decision, or evidence flags.",
  id: "auditing/user-access-review-quarterly-recertification-evidence-tester",
  inputs: [
    {
      description:
        "Maximum permitted whole-day age of supporting review evidence.",
      id: "maximumAgeDays",
      kind: "integer",
      label: "Maximum evidence age",
      minimum: 0,
    },
    {
      description:
        "Rows ordered as age in days, reviewer present, decision present, and evidence present.",
      id: "reviews",
      kind: "matrix",
      label: "Recertification evidence",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Evidence complete" },
    { id: "issueCount", kind: "integer", label: "Evidence issues", minimum: 0 },
    { id: "issueIndices", kind: "numberList", label: "Issue row indices" },
    {
      id: "reviewsChecked",
      kind: "integer",
      label: "Reviews checked",
      minimum: 0,
    },
  ],
  title: "User Access Review Quarterly Recertification Evidence Tester",
});

export const runAccessRecertification = accessRecertificationTool.execute;
export default accessRecertificationTool;
