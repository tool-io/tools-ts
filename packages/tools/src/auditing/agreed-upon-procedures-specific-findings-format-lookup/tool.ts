import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AgreedUponFindingsInput = {
  readonly findingRows: ReadonlyArray<ReadonlyArray<number>>;
};

export type AgreedUponFindingsOutput = {
  readonly completeCount: number;
  readonly formatComplete: boolean;
  readonly incompleteFindingIndices: ReadonlyArray<number>;
  readonly findingsChecked: number;
};

export const checkAgreedUponFindingsFormat = (
  input: AgreedUponFindingsInput,
): AgreedUponFindingsOutput => {
  if (!Array.isArray(input.findingRows))
    simpleError(
      "findingRows",
      "Finding rows must be an array.",
      "findings_required",
    );
  const incompleteFindingIndices: number[] = [];
  for (const [index, row] of input.findingRows.entries()) {
    if (!Array.isArray(row) || row.length !== 4)
      simpleError(
        `findingRows.${index}`,
        "Each row must contain procedure, result, conclusion, and evidence flags.",
        "invalid_finding_row",
      );
    for (const [column, value] of row.entries())
      if (value !== 0 && value !== 1)
        simpleError(
          `findingRows.${index}.${column}`,
          "Finding-format flags must be 0 or 1.",
          "invalid_finding_flag",
        );
    if (row.some((value) => value !== 1)) incompleteFindingIndices.push(index);
  }
  return {
    completeCount: input.findingRows.length - incompleteFindingIndices.length,
    formatComplete: incompleteFindingIndices.length === 0,
    incompleteFindingIndices,
    findingsChecked: input.findingRows.length,
  };
};

export const agreedUponFindingsExample = {
  input: {
    findingRows: [
      [1, 1, 1, 1],
      [1, 1, 0, 1],
    ],
  },
  output: {
    completeCount: 1,
    formatComplete: false,
    incompleteFindingIndices: [1],
    findingsChecked: 2,
  },
} satisfies ToolExample<AgreedUponFindingsInput, AgreedUponFindingsOutput>;

export const agreedUponFindingsTool = createSimpleTool({
  calculate: (input) =>
    checkAgreedUponFindingsFormat({
      findingRows: input.findingRows as number[][],
    }),
  description:
    "Check agreed-upon-procedure findings for selected procedure, result, conclusion, and evidence components and report incomplete rows.",
  id: "auditing/agreed-upon-procedures-specific-findings-format-lookup",
  inputs: [
    {
      description:
        "Rows ordered as procedure, result, conclusion, and evidence-present flags.",
      id: "findingRows",
      kind: "matrix",
      label: "Finding formats",
    },
  ],
  outputs: [
    {
      id: "completeCount",
      kind: "integer",
      label: "Complete findings",
      minimum: 0,
    },
    { id: "formatComplete", kind: "boolean", label: "All findings complete" },
    {
      id: "incompleteFindingIndices",
      kind: "numberList",
      label: "Incomplete finding indices",
    },
    {
      id: "findingsChecked",
      kind: "integer",
      label: "Findings checked",
      minimum: 0,
    },
  ],
  title: "Agreed-Upon Procedures Specific Findings Format Lookup",
});

export const runAgreedUponFindings = agreedUponFindingsTool.execute;
export default agreedUponFindingsTool;
