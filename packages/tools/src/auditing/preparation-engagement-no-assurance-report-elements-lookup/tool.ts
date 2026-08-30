import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PreparationReportInput = {
  readonly accountingResponsibilitiesIdentified: boolean;
  readonly attachmentIdentified: boolean;
  readonly disclaimerIncluded: boolean;
  readonly noAssuranceStatementIncluded: boolean;
  readonly signatureIncluded: boolean;
};

export type PreparationReportOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly missingElements: ReadonlyArray<string>;
  readonly reportElementCount: number;
};

export const checkPreparationReportElements = (
  input: PreparationReportInput,
): PreparationReportOutput => {
  const elements: readonly (readonly [string, boolean])[] = [
    ["accounting responsibilities", input.accountingResponsibilitiesIdentified],
    ["attachment identification", input.attachmentIdentified],
    ["no assurance statement", input.noAssuranceStatementIncluded],
    ["disclaimer", input.disclaimerIncluded],
    ["signature", input.signatureIncluded],
  ];
  for (const [element, present] of elements)
    if (typeof present !== "boolean")
      simpleError(
        element.replaceAll(" ", ""),
        `${element} must be a boolean.`,
        "boolean_field_required",
      );
  const missingElements = elements
    .filter(([, present]) => !present)
    .map(([element]) => element);
  return {
    complete: missingElements.length === 0,
    completedCount: elements.length - missingElements.length,
    missingElements,
    reportElementCount: elements.length,
  };
};

export const preparationReportExample = {
  input: {
    accountingResponsibilitiesIdentified: true,
    attachmentIdentified: true,
    disclaimerIncluded: false,
    noAssuranceStatementIncluded: true,
    signatureIncluded: true,
  },
  output: {
    complete: false,
    completedCount: 4,
    missingElements: ["disclaimer"],
    reportElementCount: 5,
  },
} satisfies ToolExample<PreparationReportInput, PreparationReportOutput>;

export const preparationReportTool = createSimpleTool({
  calculate: (input) =>
    checkPreparationReportElements({
      accountingResponsibilitiesIdentified:
        input.accountingResponsibilitiesIdentified as boolean,
      attachmentIdentified: input.attachmentIdentified as boolean,
      disclaimerIncluded: input.disclaimerIncluded as boolean,
      noAssuranceStatementIncluded:
        input.noAssuranceStatementIncluded as boolean,
      signatureIncluded: input.signatureIncluded as boolean,
    }),
  description:
    "Check supplied preparation-engagement report elements for responsibilities, attachment identification, no-assurance language, disclaimer, and signature.",
  id: "auditing/preparation-engagement-no-assurance-report-elements-lookup",
  inputs: [
    {
      id: "accountingResponsibilitiesIdentified",
      kind: "boolean",
      label: "Accounting responsibilities identified",
    },
    {
      id: "attachmentIdentified",
      kind: "boolean",
      label: "Attachment identified",
    },
    { id: "disclaimerIncluded", kind: "boolean", label: "Disclaimer included" },
    {
      id: "noAssuranceStatementIncluded",
      kind: "boolean",
      label: "No-assurance statement included",
    },
    { id: "signatureIncluded", kind: "boolean", label: "Signature included" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Report elements complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Elements present",
      minimum: 0,
    },
    { id: "missingElements", kind: "stringList", label: "Missing elements" },
    {
      id: "reportElementCount",
      kind: "integer",
      label: "Elements checked",
      minimum: 5,
    },
  ],
  title: "Preparation Engagement No-Assurance Report Elements Lookup",
});

export const runPreparationReport = preparationReportTool.execute;
export default preparationReportTool;
