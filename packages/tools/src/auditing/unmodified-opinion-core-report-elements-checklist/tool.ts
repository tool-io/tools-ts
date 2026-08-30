import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnmodifiedOpinionInput = {
  readonly basisForOpinionIncluded: boolean;
  readonly managementResponsibilitiesIncluded: boolean;
  readonly opinionSectionIncluded: boolean;
  readonly otherMatterIncluded: boolean;
  readonly otherMatterRequired: boolean;
  readonly auditorResponsibilitiesIncluded: boolean;
};

export type UnmodifiedOpinionOutput = {
  readonly complete: boolean;
  readonly missingElements: ReadonlyArray<string>;
  readonly satisfiedElementCount: number;
};

export const checkUnmodifiedOpinionCoreElements = (
  input: UnmodifiedOpinionInput,
): UnmodifiedOpinionOutput => {
  const elements: ReadonlyArray<
    readonly [keyof UnmodifiedOpinionInput, string, boolean]
  > = [
    ["opinionSectionIncluded", "opinion section", input.opinionSectionIncluded],
    [
      "basisForOpinionIncluded",
      "basis for opinion section",
      input.basisForOpinionIncluded,
    ],
    [
      "managementResponsibilitiesIncluded",
      "management responsibilities section",
      input.managementResponsibilitiesIncluded,
    ],
    [
      "auditorResponsibilitiesIncluded",
      "auditor responsibilities section",
      input.auditorResponsibilitiesIncluded,
    ],
    [
      "otherMatterIncluded",
      "required other-matter section",
      !input.otherMatterRequired || input.otherMatterIncluded,
    ],
  ];
  for (const field of [
    "basisForOpinionIncluded",
    "managementResponsibilitiesIncluded",
    "opinionSectionIncluded",
    "otherMatterIncluded",
    "otherMatterRequired",
    "auditorResponsibilitiesIncluded",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  const missingElements = elements
    .filter(([, , present]) => !present)
    .map(([, label]) => label);
  return {
    complete: missingElements.length === 0,
    missingElements,
    satisfiedElementCount: elements.length - missingElements.length,
  };
};

export const unmodifiedOpinionExample = {
  input: {
    auditorResponsibilitiesIncluded: true,
    basisForOpinionIncluded: true,
    managementResponsibilitiesIncluded: true,
    opinionSectionIncluded: true,
    otherMatterIncluded: false,
    otherMatterRequired: false,
  },
  output: { complete: true, missingElements: [], satisfiedElementCount: 5 },
} satisfies ToolExample<UnmodifiedOpinionInput, UnmodifiedOpinionOutput>;

export const unmodifiedOpinionTool = createSimpleTool({
  calculate: (input) =>
    checkUnmodifiedOpinionCoreElements({
      auditorResponsibilitiesIncluded:
        input.auditorResponsibilitiesIncluded as boolean,
      basisForOpinionIncluded: input.basisForOpinionIncluded as boolean,
      managementResponsibilitiesIncluded:
        input.managementResponsibilitiesIncluded as boolean,
      opinionSectionIncluded: input.opinionSectionIncluded as boolean,
      otherMatterIncluded: input.otherMatterIncluded as boolean,
      otherMatterRequired: input.otherMatterRequired as boolean,
    }),
  description:
    "Check selected core sections of a contemporary unmodified auditor's report without assuming the obsolete universal three-paragraph format. Applicable reporting standards may require additional sections.",
  id: "auditing/unmodified-opinion-core-report-elements-checklist",
  inputs: [
    {
      id: "opinionSectionIncluded",
      kind: "boolean",
      label: "Opinion section included",
    },
    {
      id: "basisForOpinionIncluded",
      kind: "boolean",
      label: "Basis for opinion included",
    },
    {
      id: "managementResponsibilitiesIncluded",
      kind: "boolean",
      label: "Management responsibilities included",
    },
    {
      id: "auditorResponsibilitiesIncluded",
      kind: "boolean",
      label: "Auditor responsibilities included",
    },
    {
      id: "otherMatterRequired",
      kind: "boolean",
      label: "Other-matter section required",
    },
    {
      id: "otherMatterIncluded",
      kind: "boolean",
      label: "Other-matter section included",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Selected elements complete" },
    { id: "missingElements", kind: "stringList", label: "Missing elements" },
    {
      id: "satisfiedElementCount",
      kind: "integer",
      label: "Satisfied elements",
      maximum: 5,
      minimum: 0,
    },
  ],
  title: "Unmodified Opinion Core Report Elements Checklist",
});

export const runUnmodifiedOpinion = unmodifiedOpinionTool.execute;
export default unmodifiedOpinionTool;
