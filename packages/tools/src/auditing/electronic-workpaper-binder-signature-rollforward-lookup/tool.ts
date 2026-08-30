import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectronicBinderRollforwardInput = {
  readonly currentVersionCount: number;
  readonly documents: ReadonlyArray<ReadonlyArray<number>>;
  readonly priorVersionCount: number;
};

export type ElectronicBinderRollforwardOutput = {
  readonly documentCount: number;
  readonly issueCount: number;
  readonly issueRowIndices: ReadonlyArray<number>;
  readonly versionsBalanced: boolean;
};

export const testElectronicBinderRollforward = (
  input: ElectronicBinderRollforwardInput,
): ElectronicBinderRollforwardOutput => {
  for (const [field, value] of [
    ["currentVersionCount", input.currentVersionCount],
    ["priorVersionCount", input.priorVersionCount],
  ] as const)
    if (!Number.isSafeInteger(value) || value < 0)
      simpleError(
        field,
        `${field} must be a nonnegative whole number.`,
        "invalid_version_count",
      );
  if (!Array.isArray(input.documents))
    simpleError(
      "documents",
      "Documents must be an array.",
      "documents_required",
    );
  const issueRowIndices: number[] = [];
  for (const [index, row] of input.documents.entries()) {
    if (!Array.isArray(row) || row.length !== 3)
      simpleError(
        `documents.${index}`,
        "Each row must contain signed, current-version, and hash-match flags.",
        "invalid_document_row",
      );
    for (const [column, value] of row.entries())
      if (value !== 0 && value !== 1)
        simpleError(
          `documents.${index}.${column}`,
          "Document flags must be 0 or 1.",
          "invalid_document_flag",
        );
    if (row.some((value) => value !== 1)) issueRowIndices.push(index);
  }
  return {
    documentCount: input.documents.length,
    issueCount: issueRowIndices.length,
    issueRowIndices,
    versionsBalanced: input.currentVersionCount === input.priorVersionCount,
  };
};

export const electronicBinderRollforwardExample = {
  input: {
    currentVersionCount: 3,
    documents: [
      [1, 1, 1],
      [0, 1, 1],
      [1, 0, 1],
    ],
    priorVersionCount: 3,
  },
  output: {
    documentCount: 3,
    issueCount: 2,
    issueRowIndices: [1, 2],
    versionsBalanced: true,
  },
} satisfies ToolExample<
  ElectronicBinderRollforwardInput,
  ElectronicBinderRollforwardOutput
>;

export const electronicBinderRollforwardTool = createSimpleTool({
  calculate: (input) =>
    testElectronicBinderRollforward({
      currentVersionCount: input.currentVersionCount as number,
      documents: input.documents as number[][],
      priorVersionCount: input.priorVersionCount as number,
    }),
  description:
    "Test electronic workpaper rows for signatures, current versions, and matching hashes and compare supplied prior and current version counts.",
  id: "auditing/electronic-workpaper-binder-signature-rollforward-lookup",
  inputs: [
    {
      id: "currentVersionCount",
      kind: "integer",
      label: "Current version count",
      minimum: 0,
    },
    {
      description:
        "Rows ordered as signed, current-version, and hash-match flags.",
      id: "documents",
      kind: "matrix",
      label: "Document status",
    },
    {
      id: "priorVersionCount",
      kind: "integer",
      label: "Prior version count",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "documentCount",
      kind: "integer",
      label: "Documents checked",
      minimum: 0,
    },
    { id: "issueCount", kind: "integer", label: "Document issues", minimum: 0 },
    { id: "issueRowIndices", kind: "numberList", label: "Issue row indices" },
    {
      id: "versionsBalanced",
      kind: "boolean",
      label: "Version counts balanced",
    },
  ],
  title: "Electronic Workpaper Binder Signature Rollforward Lookup",
});

export const runElectronicBinderRollforward =
  electronicBinderRollforwardTool.execute;
export default electronicBinderRollforwardTool;
