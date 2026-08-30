import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AfterActionReviewInput = {
  readonly actualActions: ReadonlyArray<string>;
  readonly expectedActions: ReadonlyArray<string>;
  readonly outcome: string;
};

export type AfterActionReviewOutput = {
  readonly matchedActions: ReadonlyArray<string>;
  readonly missingActions: ReadonlyArray<string>;
  readonly reviewTemplate: string;
  readonly unexpectedActions: ReadonlyArray<string>;
};

export const buildAfterActionReviewTemplate = (
  input: AfterActionReviewInput,
): AfterActionReviewOutput => {
  if (typeof input.outcome !== "string" || input.outcome.trim() === "")
    simpleError(
      "outcome",
      "Outcome must be a nonempty string.",
      "outcome_required",
    );
  if (!Array.isArray(input.expectedActions))
    simpleError(
      "expectedActions",
      "Expected actions must be an array.",
      "expected_actions_required",
    );
  if (!Array.isArray(input.actualActions))
    simpleError(
      "actualActions",
      "Actual actions must be an array.",
      "actual_actions_required",
    );
  const normalize = (actions: ReadonlyArray<string>, field: string): string[] =>
    actions.map((action, index) => {
      if (typeof action !== "string" || action.trim() === "")
        simpleError(
          `${field}.${index}`,
          "Actions must be nonempty strings.",
          "invalid_action",
        );
      return action.trim().toLowerCase();
    });
  const expectedActions = normalize(input.expectedActions, "expectedActions");
  const actualActions = normalize(input.actualActions, "actualActions");
  const matchedActions = input.expectedActions
    .map((action) => action.trim())
    .filter((_, index) => actualActions.includes(expectedActions[index]!));
  const missingActions = input.expectedActions
    .map((action) => action.trim())
    .filter((_, index) => !actualActions.includes(expectedActions[index]!));
  const unexpectedActions = input.actualActions
    .map((action) => action.trim())
    .filter((_, index) => !expectedActions.includes(actualActions[index]!));
  return {
    matchedActions,
    missingActions,
    reviewTemplate: `Outcome: ${input.outcome.trim()}\nExpected and matched: ${matchedActions.join("; ") || "none"}\nMissing: ${missingActions.join("; ") || "none"}\nUnexpected: ${unexpectedActions.join("; ") || "none"}\nRoot causes: [to complete]\nLessons: [to complete]`,
    unexpectedActions,
  };
};

export const afterActionReviewExample = {
  input: {
    actualActions: ["PILOT COMPLETED", "Report published"],
    expectedActions: ["Pilot completed", "Stakeholders briefed"],
    outcome: "The pilot informed the next release.",
  },
  output: {
    matchedActions: ["Pilot completed"],
    missingActions: ["Stakeholders briefed"],
    reviewTemplate:
      "Outcome: The pilot informed the next release.\nExpected and matched: Pilot completed\nMissing: Stakeholders briefed\nUnexpected: Report published\nRoot causes: [to complete]\nLessons: [to complete]",
    unexpectedActions: ["Report published"],
  },
} satisfies ToolExample<AfterActionReviewInput, AfterActionReviewOutput>;

export const afterActionReviewTool = createSimpleTool({
  calculate: (input) =>
    buildAfterActionReviewTemplate({
      actualActions: input.actualActions as string[],
      expectedActions: input.expectedActions as string[],
      outcome: input.outcome as string,
    }),
  description:
    "Compare expected and actual actions after case-normalization and build a structured after-action review template.",
  id: "futurology/after-action-review-expected-actual-template",
  inputs: [
    { id: "actualActions", kind: "stringList", label: "Actual actions" },
    { id: "expectedActions", kind: "stringList", label: "Expected actions" },
    { id: "outcome", kind: "string", label: "Outcome" },
  ],
  outputs: [
    { id: "matchedActions", kind: "stringList", label: "Matched actions" },
    { id: "missingActions", kind: "stringList", label: "Missing actions" },
    { id: "reviewTemplate", kind: "string", label: "Review template" },
    {
      id: "unexpectedActions",
      kind: "stringList",
      label: "Unexpected actions",
    },
  ],
  title: "After Action Review Expected Actual Template",
});

export const runAfterActionReview = afterActionReviewTool.execute;
export default afterActionReviewTool;
