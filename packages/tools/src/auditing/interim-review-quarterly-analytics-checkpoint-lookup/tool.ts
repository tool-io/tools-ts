import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InterimReviewCheckpointInput = {
  readonly controlChangesDocumented: boolean;
  readonly discrepanciesResolved: boolean;
  readonly periodEndReconciled: boolean;
  readonly reviewApproved: boolean;
  readonly subsequentEventsReviewed: boolean;
};

export type InterimReviewCheckpointOutput = {
  readonly checkpointComplete: boolean;
  readonly completedCount: number;
  readonly missingItems: ReadonlyArray<string>;
  readonly reviewItemCount: number;
};

export const checkInterimReviewCheckpoint = (
  input: InterimReviewCheckpointInput,
): InterimReviewCheckpointOutput => {
  const items: readonly (readonly [string, boolean])[] = [
    ["period end reconciliation", input.periodEndReconciled],
    ["discrepancy resolution", input.discrepanciesResolved],
    ["control change documentation", input.controlChangesDocumented],
    ["subsequent event review", input.subsequentEventsReviewed],
    ["review approval", input.reviewApproved],
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
    checkpointComplete: missingItems.length === 0,
    completedCount: items.length - missingItems.length,
    missingItems,
    reviewItemCount: items.length,
  };
};

export const interimReviewCheckpointExample = {
  input: {
    controlChangesDocumented: true,
    discrepanciesResolved: true,
    periodEndReconciled: false,
    reviewApproved: false,
    subsequentEventsReviewed: true,
  },
  output: {
    checkpointComplete: false,
    completedCount: 3,
    missingItems: ["period end reconciliation", "review approval"],
    reviewItemCount: 5,
  },
} satisfies ToolExample<
  InterimReviewCheckpointInput,
  InterimReviewCheckpointOutput
>;

export const interimReviewCheckpointTool = createSimpleTool({
  calculate: (input) =>
    checkInterimReviewCheckpoint({
      controlChangesDocumented: input.controlChangesDocumented as boolean,
      discrepanciesResolved: input.discrepanciesResolved as boolean,
      periodEndReconciled: input.periodEndReconciled as boolean,
      reviewApproved: input.reviewApproved as boolean,
      subsequentEventsReviewed: input.subsequentEventsReviewed as boolean,
    }),
  description:
    "Check supplied interim-review checkpoints for reconciliation, discrepancy resolution, control changes, subsequent events, and approval.",
  id: "auditing/interim-review-quarterly-analytics-checkpoint-lookup",
  inputs: [
    {
      id: "controlChangesDocumented",
      kind: "boolean",
      label: "Control changes documented",
    },
    {
      id: "discrepanciesResolved",
      kind: "boolean",
      label: "Discrepancies resolved",
    },
    {
      id: "periodEndReconciled",
      kind: "boolean",
      label: "Period end reconciled",
    },
    { id: "reviewApproved", kind: "boolean", label: "Review approved" },
    {
      id: "subsequentEventsReviewed",
      kind: "boolean",
      label: "Subsequent events reviewed",
    },
  ],
  outputs: [
    {
      id: "checkpointComplete",
      kind: "boolean",
      label: "Checkpoint complete",
    },
    {
      id: "completedCount",
      kind: "integer",
      label: "Items complete",
      minimum: 0,
    },
    { id: "missingItems", kind: "stringList", label: "Missing items" },
    {
      id: "reviewItemCount",
      kind: "integer",
      label: "Items checked",
      minimum: 5,
    },
  ],
  title: "Interim Review Quarterly Analytics Checkpoint Lookup",
});

export const runInterimReviewCheckpoint = interimReviewCheckpointTool.execute;
export default interimReviewCheckpointTool;
