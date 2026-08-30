import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ManagementOverrideFocusInput = {
  readonly attributes: ReadonlyArray<ReadonlyArray<number>>;
  readonly entryIds: ReadonlyArray<string>;
  readonly selectionThreshold: number;
};

export type ManagementOverrideFocusOutput = {
  readonly selectedCount: number;
  readonly selectedIds: ReadonlyArray<string>;
  readonly totalEntries: number;
};

export const selectManagementOverrideJournalEntries = (
  input: ManagementOverrideFocusInput,
): ManagementOverrideFocusOutput => {
  if (
    !Number.isSafeInteger(input.selectionThreshold) ||
    input.selectionThreshold < 1 ||
    input.selectionThreshold > 4
  )
    simpleError(
      "selectionThreshold",
      "The selection threshold must be a whole number from 1 through 4.",
      "invalid_selection_threshold",
    );
  if (!Array.isArray(input.entryIds) || !Array.isArray(input.attributes))
    simpleError(
      "",
      "Entry IDs and attributes must be arrays.",
      "entry_data_required",
    );
  if (input.entryIds.length !== input.attributes.length)
    simpleError(
      "attributes",
      "Each entry ID must have one five-value attribute row.",
      "entry_data_length_mismatch",
    );
  const selectedIds: string[] = [];
  for (const [index, id] of input.entryIds.entries()) {
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `entryIds.${index}`,
        "Entry IDs must be nonempty strings.",
        "invalid_entry_id",
      );
    const row = input.attributes[index]!;
    if (!Array.isArray(row) || row.length !== 5)
      simpleError(
        `attributes.${index}`,
        "Each row must contain manual, override, unusual, period-end, and approved flags.",
        "invalid_entry_attributes",
      );
    for (const [column, value] of row.entries())
      if (value !== 0 && value !== 1)
        simpleError(
          `attributes.${index}.${column}`,
          "Attribute flags must be 0 or 1.",
          "invalid_entry_flag",
        );
    const score = row[0]! + row[1]! + row[2]! + row[3]!;
    if (score >= input.selectionThreshold && row[4]! === 0)
      selectedIds.push(id.trim());
  }
  return {
    selectedCount: selectedIds.length,
    selectedIds,
    totalEntries: input.entryIds.length,
  };
};

export const managementOverrideFocusExample = {
  input: {
    attributes: [
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 1],
    ],
    entryIds: ["JE-1001", "JE-1002", "JE-1003"],
    selectionThreshold: 2,
  },
  output: { selectedCount: 1, selectedIds: ["JE-1001"], totalEntries: 3 },
} satisfies ToolExample<
  ManagementOverrideFocusInput,
  ManagementOverrideFocusOutput
>;

export const managementOverrideFocusTool = createSimpleTool({
  calculate: (input) =>
    selectManagementOverrideJournalEntries({
      attributes: input.attributes as number[][],
      entryIds: input.entryIds as string[],
      selectionThreshold: input.selectionThreshold as number,
    }),
  description:
    "Select unapproved journal entries meeting a caller-defined risk score built from manual, override, unusual, and period-end indicators.",
  id: "auditing/management-override-journal-entry-testing-focus-lookup",
  inputs: [
    {
      description:
        "Rows ordered as manual, override, unusual, period-end, and approved binary flags.",
      id: "attributes",
      kind: "matrix",
      label: "Entry risk attributes",
    },
    {
      description: "One stable identifier for each journal entry.",
      id: "entryIds",
      kind: "stringList",
      label: "Journal entry IDs",
    },
    {
      description:
        "Minimum unapproved risk-attribute score selected for testing.",
      id: "selectionThreshold",
      kind: "integer",
      label: "Selection threshold",
      maximum: 4,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "selectedCount",
      kind: "integer",
      label: "Selected entries",
      minimum: 0,
    },
    { id: "selectedIds", kind: "stringList", label: "Selected entry IDs" },
    {
      id: "totalEntries",
      kind: "integer",
      label: "Entries reviewed",
      minimum: 0,
    },
  ],
  title: "Management Override Journal Entry Testing Focus Lookup",
});

export const runManagementOverrideFocus = managementOverrideFocusTool.execute;
export default managementOverrideFocusTool;
