import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OtherMatterSelectorInput = {
  readonly fundamentalToUnderstandingFinancialStatements: boolean;
  readonly matterPresentedOrDisclosed: boolean;
  readonly otherMatterRelevantToUsers: boolean;
  readonly requiresModifiedOpinion: boolean;
};

export type OtherMatterSelectorOutput = {
  readonly selection:
    | "both"
    | "emphasis_of_matter"
    | "modified_opinion"
    | "no_additional_section"
    | "other_matter";
};

export const selectEmphasisOrOtherMatter = (
  input: OtherMatterSelectorInput,
): OtherMatterSelectorOutput => {
  for (const field of [
    "fundamentalToUnderstandingFinancialStatements",
    "matterPresentedOrDisclosed",
    "otherMatterRelevantToUsers",
    "requiresModifiedOpinion",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    input.fundamentalToUnderstandingFinancialStatements &&
    !input.matterPresentedOrDisclosed
  )
    simpleError(
      "matterPresentedOrDisclosed",
      "An emphasis-of-matter candidate must already be appropriately presented or disclosed in the financial statements.",
      "emphasis_matter_not_presented",
    );
  if (input.requiresModifiedOpinion) return { selection: "modified_opinion" };

  const emphasisOfMatter =
    input.matterPresentedOrDisclosed &&
    input.fundamentalToUnderstandingFinancialStatements;
  if (emphasisOfMatter && input.otherMatterRelevantToUsers)
    return { selection: "both" };
  if (emphasisOfMatter) return { selection: "emphasis_of_matter" };
  if (input.otherMatterRelevantToUsers) return { selection: "other_matter" };
  return { selection: "no_additional_section" };
};

export const otherMatterSelectorExample = {
  input: {
    fundamentalToUnderstandingFinancialStatements: true,
    matterPresentedOrDisclosed: true,
    otherMatterRelevantToUsers: false,
    requiresModifiedOpinion: false,
  },
  output: { selection: "emphasis_of_matter" },
} satisfies ToolExample<OtherMatterSelectorInput, OtherMatterSelectorOutput>;

export const otherMatterSelectorTool = createSimpleTool({
  calculate: (input) =>
    selectEmphasisOrOtherMatter({
      fundamentalToUnderstandingFinancialStatements:
        input.fundamentalToUnderstandingFinancialStatements as boolean,
      matterPresentedOrDisclosed: input.matterPresentedOrDisclosed as boolean,
      otherMatterRelevantToUsers: input.otherMatterRelevantToUsers as boolean,
      requiresModifiedOpinion: input.requiresModifiedOpinion as boolean,
    }),
  description:
    "Distinguish an emphasis-of-matter paragraph from an other-matter paragraph using where the matter is presented and why it matters to users. A required opinion modification takes precedence and must not be replaced by either paragraph.",
  id: "auditing/emphasis-of-matter-other-matter-paragraph-selector",
  inputs: [
    {
      id: "fundamentalToUnderstandingFinancialStatements",
      kind: "boolean",
      label: "Fundamental to understanding statements",
    },
    {
      id: "matterPresentedOrDisclosed",
      kind: "boolean",
      label: "Matter presented or disclosed",
    },
    {
      id: "otherMatterRelevantToUsers",
      kind: "boolean",
      label: "Other matter relevant to users",
    },
    {
      id: "requiresModifiedOpinion",
      kind: "boolean",
      label: "Requires modified opinion",
    },
  ],
  outputs: [
    {
      enum: [
        "both",
        "emphasis_of_matter",
        "modified_opinion",
        "no_additional_section",
        "other_matter",
      ],
      id: "selection",
      kind: "string",
      label: "Report treatment",
    },
  ],
  title: "Emphasis of Matter or Other Matter Paragraph Selector",
});

export const runOtherMatterSelector = otherMatterSelectorTool.execute;
export default otherMatterSelectorTool;
