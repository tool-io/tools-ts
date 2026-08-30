import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WrapUpChecklistInput = {
  readonly finalReviewApproved: boolean;
  readonly financialStatementsFinalized: boolean;
  readonly managementRepresentationReceived: boolean;
  readonly subsequentEventsReviewed: boolean;
  readonly unadjustedMisstatementsApproved: boolean;
};

export type WrapUpChecklistOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly missingItems: ReadonlyArray<string>;
  readonly wrapUpItemCount: number;
};

export const checkAuditWrapUpFile = (
  input: WrapUpChecklistInput,
): WrapUpChecklistOutput => {
  const items: readonly (readonly [string, boolean])[] = [
    ["financial statements finalized", input.financialStatementsFinalized],
    [
      "management representation received",
      input.managementRepresentationReceived,
    ],
    ["subsequent events reviewed", input.subsequentEventsReviewed],
    [
      "unadjusted misstatements approved",
      input.unadjustedMisstatementsApproved,
    ],
    ["final review approved", input.finalReviewApproved],
  ];
  for (const [item, complete] of items)
    if (typeof complete !== "boolean")
      simpleError(
        item.replaceAll(" ", ""),
        `${item} must be a boolean.`,
        "boolean_field_required",
      );
  const missingItems = items
    .filter(([, complete]) => !complete)
    .map(([item]) => item);
  return {
    complete: missingItems.length === 0,
    completedCount: items.length - missingItems.length,
    missingItems,
    wrapUpItemCount: items.length,
  };
};

export const wrapUpChecklistExample = {
  input: {
    finalReviewApproved: false,
    financialStatementsFinalized: true,
    managementRepresentationReceived: true,
    subsequentEventsReviewed: true,
    unadjustedMisstatementsApproved: true,
  },
  output: {
    complete: false,
    completedCount: 4,
    missingItems: ["final review approved"],
    wrapUpItemCount: 5,
  },
} satisfies ToolExample<WrapUpChecklistInput, WrapUpChecklistOutput>;

export const wrapUpChecklistTool = createSimpleTool({
  calculate: (input) =>
    checkAuditWrapUpFile({
      finalReviewApproved: input.finalReviewApproved as boolean,
      financialStatementsFinalized:
        input.financialStatementsFinalized as boolean,
      managementRepresentationReceived:
        input.managementRepresentationReceived as boolean,
      subsequentEventsReviewed: input.subsequentEventsReviewed as boolean,
      unadjustedMisstatementsApproved:
        input.unadjustedMisstatementsApproved as boolean,
    }),
  description:
    "Check five caller-defined audit wrap-up completion facts and list missing finalization, representation, events, misstatement, or approval items.",
  id: "auditing/wrap-up-file-final-review-partner-signoff-checklist",
  inputs: [
    {
      id: "finalReviewApproved",
      kind: "boolean",
      label: "Final review approved",
    },
    {
      id: "financialStatementsFinalized",
      kind: "boolean",
      label: "Financial statements finalized",
    },
    {
      id: "managementRepresentationReceived",
      kind: "boolean",
      label: "Management representation received",
    },
    {
      id: "subsequentEventsReviewed",
      kind: "boolean",
      label: "Subsequent events reviewed",
    },
    {
      id: "unadjustedMisstatementsApproved",
      kind: "boolean",
      label: "Unadjusted misstatements approved",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Wrap-up complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Items complete",
      minimum: 0,
    },
    { id: "missingItems", kind: "stringList", label: "Missing items" },
    {
      id: "wrapUpItemCount",
      kind: "integer",
      label: "Items checked",
      minimum: 5,
    },
  ],
  title: "Wrap-Up File Final Review Partner Sign-Off Checklist",
});

export const runWrapUpChecklist = wrapUpChecklistTool.execute;
export default wrapUpChecklistTool;
