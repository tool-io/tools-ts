import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JournalRiskFilterInput = {
  readonly entryAttributes: ReadonlyArray<ReadonlyArray<number>>;
  readonly entryIds: ReadonlyArray<string>;
  readonly selectionThreshold: number;
  readonly weights: ReadonlyArray<number>;
};

export type JournalRiskFilterOutput = {
  readonly scores: ReadonlyArray<number>;
  readonly selectedCount: number;
  readonly selectedIds: ReadonlyArray<string>;
};

export const buildJournalRiskFilter = (
  input: JournalRiskFilterInput,
): JournalRiskFilterOutput => {
  if (!Array.isArray(input.weights) || input.weights.length !== 4)
    simpleError(
      "weights",
      "Exactly four criterion weights are required.",
      "invalid_filter_weights",
    );
  for (const [index, weight] of input.weights.entries())
    if (!Number.isFinite(weight) || weight < 0)
      simpleError(
        `weights.${index}`,
        "Criterion weights must be finite and nonnegative.",
        "invalid_filter_weight",
      );
  if (
    !Number.isFinite(input.selectionThreshold) ||
    input.selectionThreshold < 0
  )
    simpleError(
      "selectionThreshold",
      "Selection threshold must be finite and nonnegative.",
      "invalid_filter_threshold",
    );
  if (!Array.isArray(input.entryIds) || !Array.isArray(input.entryAttributes))
    simpleError(
      "",
      "Entry IDs and attributes must be arrays.",
      "journal_data_required",
    );
  if (input.entryIds.length !== input.entryAttributes.length)
    simpleError(
      "entryAttributes",
      "Each entry ID must have one four-attribute row.",
      "journal_data_length_mismatch",
    );
  const scores: number[] = [];
  const selectedIds: string[] = [];
  for (const [index, id] of input.entryIds.entries()) {
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `entryIds.${index}`,
        "Entry IDs must be nonempty strings.",
        "invalid_entry_id",
      );
    const attributes = input.entryAttributes[index]!;
    if (!Array.isArray(attributes) || attributes.length !== 4)
      simpleError(
        `entryAttributes.${index}`,
        "Each row must contain manual, override, unusual, and period-end flags.",
        "invalid_entry_attributes",
      );
    let score = 0;
    for (const [column, flag] of attributes.entries()) {
      if (flag !== 0 && flag !== 1)
        simpleError(
          `entryAttributes.${index}.${column}`,
          "Entry attributes must be 0 or 1.",
          "invalid_entry_flag",
        );
      score += flag * input.weights[column]!;
    }
    if (!Number.isFinite(score))
      simpleError(
        `entryAttributes.${index}`,
        "Entry risk score is not finite.",
        "result_not_finite",
      );
    scores.push(score);
    if (score >= input.selectionThreshold) selectedIds.push(id.trim());
  }
  return { scores, selectedCount: selectedIds.length, selectedIds };
};

export const journalRiskFilterExample = {
  input: {
    entryAttributes: [
      [1, 1, 1, 1],
      [1, 0, 0, 0],
    ],
    entryIds: ["JE-1", "JE-2"],
    selectionThreshold: 5,
    weights: [1, 2, 3, 4],
  },
  output: { scores: [10, 1], selectedCount: 1, selectedIds: ["JE-1"] },
} satisfies ToolExample<JournalRiskFilterInput, JournalRiskFilterOutput>;

export const journalRiskFilterTool = createSimpleTool({
  calculate: (input) =>
    buildJournalRiskFilter({
      entryAttributes: input.entryAttributes as number[][],
      entryIds: input.entryIds as string[],
      selectionThreshold: input.selectionThreshold as number,
      weights: input.weights as number[],
    }),
  description:
    "Score journal entries from four binary risk attributes and caller-supplied weights, then select entries meeting an explicit score threshold.",
  id: "auditing/journal-entry-testing-risk-based-filter-criteria-builder",
  inputs: [
    {
      description:
        "Rows ordered as manual, override, unusual, and period-end flags.",
      id: "entryAttributes",
      kind: "matrix",
      label: "Entry risk attributes",
    },
    { id: "entryIds", kind: "stringList", label: "Journal entry IDs" },
    {
      description: "Minimum weighted score selected for testing.",
      id: "selectionThreshold",
      kind: "number",
      label: "Selection threshold",
      minimum: 0,
    },
    {
      description: "Four nonnegative weights aligned with entry attributes.",
      id: "weights",
      kind: "numberList",
      label: "Criterion weights",
    },
  ],
  outputs: [
    { id: "scores", kind: "numberList", label: "Weighted risk scores" },
    {
      id: "selectedCount",
      kind: "integer",
      label: "Selected entries",
      minimum: 0,
    },
    { id: "selectedIds", kind: "stringList", label: "Selected entry IDs" },
  ],
  title: "Journal Entry Testing Risk-Based Filter Criteria Builder",
});

export const runJournalRiskFilter = journalRiskFilterTool.execute;
export default journalRiskFilterTool;
