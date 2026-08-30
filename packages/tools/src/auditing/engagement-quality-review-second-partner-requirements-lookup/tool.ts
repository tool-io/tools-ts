import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EngagementQualityReviewInput = {
  readonly checklistComplete: boolean;
  readonly firstReviewer: string;
  readonly secondReviewer: string;
  readonly secondReviewerIndependent: boolean;
  readonly significantJudgmentsReviewed: boolean;
  readonly signed: boolean;
};

export type EngagementQualityReviewOutput = {
  readonly complete: boolean;
  readonly issueCount: number;
  readonly issues: ReadonlyArray<string>;
};

export const checkSecondPartnerRequirements = (
  input: EngagementQualityReviewInput,
): EngagementQualityReviewOutput => {
  for (const field of ["firstReviewer", "secondReviewer"] as const)
    if (typeof input[field] !== "string" || input[field].trim() === "")
      simpleError(
        field,
        `${field} must be a nonempty string.`,
        "reviewer_required",
      );
  for (const field of [
    "checklistComplete",
    "secondReviewerIndependent",
    "significantJudgmentsReviewed",
    "signed",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  const issues: string[] = [];
  if (
    input.firstReviewer.trim().toLowerCase() ===
    input.secondReviewer.trim().toLowerCase()
  )
    issues.push("reviewers_must_differ");
  if (!input.secondReviewerIndependent)
    issues.push("second_reviewer_not_independent");
  if (!input.significantJudgmentsReviewed)
    issues.push("significant_judgments_not_reviewed");
  if (!input.checklistComplete) issues.push("checklist_incomplete");
  if (!input.signed) issues.push("review_not_signed");
  return { complete: issues.length === 0, issueCount: issues.length, issues };
};

export const engagementQualityReviewExample = {
  input: {
    checklistComplete: true,
    firstReviewer: "Alex Chen",
    secondReviewer: "Jordan Lee",
    secondReviewerIndependent: true,
    significantJudgmentsReviewed: true,
    signed: true,
  },
  output: { complete: true, issueCount: 0, issues: [] },
} satisfies ToolExample<
  EngagementQualityReviewInput,
  EngagementQualityReviewOutput
>;

export const engagementQualityReviewTool = createSimpleTool({
  calculate: (input) =>
    checkSecondPartnerRequirements({
      checklistComplete: input.checklistComplete as boolean,
      firstReviewer: input.firstReviewer as string,
      secondReviewer: input.secondReviewer as string,
      secondReviewerIndependent: input.secondReviewerIndependent as boolean,
      significantJudgmentsReviewed:
        input.significantJudgmentsReviewed as boolean,
      signed: input.signed as boolean,
    }),
  description:
    "Check caller-supplied engagement-quality review records for a distinct independent second reviewer, significant-judgment review, completed checklist, and sign-off.",
  id: "auditing/engagement-quality-review-second-partner-requirements-lookup",
  inputs: [
    { id: "checklistComplete", kind: "boolean", label: "Checklist complete" },
    { id: "firstReviewer", kind: "string", label: "First reviewer" },
    { id: "secondReviewer", kind: "string", label: "Second reviewer" },
    {
      id: "secondReviewerIndependent",
      kind: "boolean",
      label: "Second reviewer independent",
    },
    {
      id: "significantJudgmentsReviewed",
      kind: "boolean",
      label: "Significant judgments reviewed",
    },
    { id: "signed", kind: "boolean", label: "Review signed" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Review requirements met" },
    {
      id: "issueCount",
      kind: "integer",
      label: "Requirement issues",
      minimum: 0,
    },
    { id: "issues", kind: "stringList", label: "Issue labels" },
  ],
  title: "Engagement Quality Review Second Partner Requirements Lookup",
});

export const runEngagementQualityReview = engagementQualityReviewTool.execute;
export default engagementQualityReviewTool;
