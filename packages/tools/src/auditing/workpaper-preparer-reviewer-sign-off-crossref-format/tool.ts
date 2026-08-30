import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WorkpaperSignoffInput = {
  readonly preparer: string;
  readonly reference: string;
  readonly reviewDate: string;
  readonly reviewer: string;
  readonly signedDate: string;
};

export type WorkpaperSignoffOutput = {
  readonly complete: boolean;
  readonly issueCount: number;
  readonly issues: ReadonlyArray<string>;
};

export const checkWorkpaperSignoffFormat = (
  input: WorkpaperSignoffInput,
): WorkpaperSignoffOutput => {
  const values: readonly (readonly [keyof WorkpaperSignoffInput, string])[] = [
    ["preparer", input.preparer],
    ["reference", input.reference],
    ["reviewDate", input.reviewDate],
    ["reviewer", input.reviewer],
    ["signedDate", input.signedDate],
  ];
  for (const [field, value] of values)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        `${field} must be a nonempty string.`,
        "signoff_field_required",
      );
  const issues: string[] = [];
  if (
    input.preparer.trim().toLowerCase() === input.reviewer.trim().toLowerCase()
  )
    issues.push("preparer_and_reviewer_must_differ");
  if (input.signedDate.trim() !== input.reviewDate.trim())
    issues.push("signoff_dates_must_match");
  return { complete: issues.length === 0, issueCount: issues.length, issues };
};

export const workpaperSignoffExample = {
  input: {
    preparer: "Alex Chen",
    reference: "AR-12",
    reviewDate: "2026-03-18",
    reviewer: "Jordan Lee",
    signedDate: "2026-03-18",
  },
  output: { complete: true, issueCount: 0, issues: [] },
} satisfies ToolExample<WorkpaperSignoffInput, WorkpaperSignoffOutput>;

export const workpaperSignoffTool = createSimpleTool({
  calculate: (input) =>
    checkWorkpaperSignoffFormat({
      preparer: input.preparer as string,
      reference: input.reference as string,
      reviewDate: input.reviewDate as string,
      reviewer: input.reviewer as string,
      signedDate: input.signedDate as string,
    }),
  description:
    "Check a workpaper sign-off record for a reference, distinct preparer and reviewer, and matching sign-off and review dates.",
  id: "auditing/workpaper-preparer-reviewer-sign-off-crossref-format",
  inputs: [
    { id: "preparer", kind: "string", label: "Preparer" },
    { id: "reference", kind: "string", label: "Workpaper reference" },
    { id: "reviewDate", kind: "string", label: "Review date" },
    { id: "reviewer", kind: "string", label: "Reviewer" },
    { id: "signedDate", kind: "string", label: "Sign-off date" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Sign-off complete" },
    { id: "issueCount", kind: "integer", label: "Format issues", minimum: 0 },
    { id: "issues", kind: "stringList", label: "Issue labels" },
  ],
  title: "Workpaper Preparer Reviewer Sign-Off Cross-Reference Format",
});

export const runWorkpaperSignoff = workpaperSignoffTool.execute;
export default workpaperSignoffTool;
