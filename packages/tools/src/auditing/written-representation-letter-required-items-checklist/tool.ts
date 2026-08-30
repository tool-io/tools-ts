import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WrittenRepresentationInput = {
  readonly addressedAllFraud: boolean;
  readonly addressedAllLegalMatters: boolean;
  readonly confirmedFinancialStatementCompleteness: boolean;
  readonly confirmedManagementResponsibilities: boolean;
  readonly signed: boolean;
};

export type WrittenRepresentationOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly missingItems: ReadonlyArray<string>;
  readonly requiredItemCount: number;
};

export const checkWrittenRepresentationLetter = (
  input: WrittenRepresentationInput,
): WrittenRepresentationOutput => {
  const items: readonly (readonly [string, boolean])[] = [
    [
      "financial statement completeness",
      input.confirmedFinancialStatementCompleteness,
    ],
    ["management responsibilities", input.confirmedManagementResponsibilities],
    ["legal matters", input.addressedAllLegalMatters],
    ["fraud", input.addressedAllFraud],
    ["signature", input.signed],
  ];
  for (const [item, present] of items)
    if (typeof present !== "boolean")
      simpleError(
        item.replaceAll(" ", ""),
        `${item} must be a boolean.`,
        "boolean_field_required",
      );
  const missingItems = items
    .filter(([, present]) => !present)
    .map(([item]) => item);
  return {
    complete: missingItems.length === 0,
    completedCount: items.length - missingItems.length,
    missingItems,
    requiredItemCount: items.length,
  };
};

export const writtenRepresentationExample = {
  input: {
    addressedAllFraud: true,
    addressedAllLegalMatters: true,
    confirmedFinancialStatementCompleteness: true,
    confirmedManagementResponsibilities: true,
    signed: false,
  },
  output: {
    complete: false,
    completedCount: 4,
    missingItems: ["signature"],
    requiredItemCount: 5,
  },
} satisfies ToolExample<
  WrittenRepresentationInput,
  WrittenRepresentationOutput
>;

export const writtenRepresentationTool = createSimpleTool({
  calculate: (input) =>
    checkWrittenRepresentationLetter({
      addressedAllFraud: input.addressedAllFraud as boolean,
      addressedAllLegalMatters: input.addressedAllLegalMatters as boolean,
      confirmedFinancialStatementCompleteness:
        input.confirmedFinancialStatementCompleteness as boolean,
      confirmedManagementResponsibilities:
        input.confirmedManagementResponsibilities as boolean,
      signed: input.signed as boolean,
    }),
  description:
    "Check a supplied written-representation letter for five selected completion facts and report omitted items without supplying legal conclusions.",
  id: "auditing/written-representation-letter-required-items-checklist",
  inputs: [
    { id: "addressedAllFraud", kind: "boolean", label: "All fraud addressed" },
    {
      id: "addressedAllLegalMatters",
      kind: "boolean",
      label: "All legal matters addressed",
    },
    {
      id: "confirmedFinancialStatementCompleteness",
      kind: "boolean",
      label: "Financial statement completeness confirmed",
    },
    {
      id: "confirmedManagementResponsibilities",
      kind: "boolean",
      label: "Management responsibilities confirmed",
    },
    { id: "signed", kind: "boolean", label: "Letter signed" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Letter complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Items complete",
      minimum: 0,
    },
    { id: "missingItems", kind: "stringList", label: "Missing items" },
    {
      id: "requiredItemCount",
      kind: "integer",
      label: "Items checked",
      minimum: 5,
    },
  ],
  title: "Written Representation Letter Required Items Checklist",
});

export const runWrittenRepresentation = writtenRepresentationTool.execute;
export default writtenRepresentationTool;
