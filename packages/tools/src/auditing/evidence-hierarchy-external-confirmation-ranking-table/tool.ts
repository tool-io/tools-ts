import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EvidenceHierarchyInput = {
  readonly hierarchy: ReadonlyArray<string>;
  readonly selectedEvidenceType: string;
};

export type EvidenceHierarchyOutput = {
  readonly selectedRank: number;
  readonly strongerCount: number;
  readonly strongerEvidence: ReadonlyArray<string>;
};

export const rankEvidenceAgainstHierarchy = (
  input: EvidenceHierarchyInput,
): EvidenceHierarchyOutput => {
  if (
    typeof input.selectedEvidenceType !== "string" ||
    input.selectedEvidenceType.trim() === ""
  )
    simpleError(
      "selectedEvidenceType",
      "A selected evidence type is required.",
      "selected_evidence_required",
    );
  if (!Array.isArray(input.hierarchy) || input.hierarchy.length === 0)
    simpleError(
      "hierarchy",
      "At least one ranked evidence type is required.",
      "hierarchy_required",
    );
  const hierarchy = input.hierarchy.map((value, index) => {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `hierarchy.${index}`,
        "Hierarchy entries must be nonempty strings.",
        "invalid_hierarchy_entry",
      );
    return value.trim();
  });
  if (
    new Set(hierarchy.map((value) => value.toLowerCase())).size !==
    hierarchy.length
  )
    simpleError(
      "hierarchy",
      "Hierarchy entries must be unique.",
      "duplicate_hierarchy_entry",
    );
  const selected = input.selectedEvidenceType.trim().toLowerCase();
  const selectedIndex = hierarchy.findIndex(
    (value) => value.toLowerCase() === selected,
  );
  if (selectedIndex < 0)
    simpleError(
      "selectedEvidenceType",
      "The selected evidence type must appear in the hierarchy.",
      "evidence_type_not_ranked",
    );
  return {
    selectedRank: selectedIndex + 1,
    strongerCount: selectedIndex,
    strongerEvidence: hierarchy.slice(0, selectedIndex),
  };
};

export const evidenceHierarchyExample = {
  input: {
    hierarchy: [
      "External confirmation",
      "Inspection of original documentation",
      "Management representation",
    ],
    selectedEvidenceType: "inspection of original documentation",
  },
  output: {
    selectedRank: 2,
    strongerCount: 1,
    strongerEvidence: ["External confirmation"],
  },
} satisfies ToolExample<EvidenceHierarchyInput, EvidenceHierarchyOutput>;

export const evidenceHierarchyTool = createSimpleTool({
  calculate: (input) =>
    rankEvidenceAgainstHierarchy({
      hierarchy: input.hierarchy as string[],
      selectedEvidenceType: input.selectedEvidenceType as string,
    }),
  description:
    "Locate a selected evidence type in a caller-supplied strongest-to-weakest hierarchy and return its one-based rank and stronger evidence labels.",
  id: "auditing/evidence-hierarchy-external-confirmation-ranking-table",
  inputs: [
    {
      description: "Unique evidence types ordered from strongest to weakest.",
      id: "hierarchy",
      kind: "stringList",
      label: "Evidence hierarchy",
    },
    {
      description: "Evidence type whose position should be returned.",
      id: "selectedEvidenceType",
      kind: "string",
      label: "Selected evidence type",
    },
  ],
  outputs: [
    {
      id: "selectedRank",
      kind: "integer",
      label: "Selected rank",
      minimum: 1,
    },
    {
      id: "strongerCount",
      kind: "integer",
      label: "Stronger evidence types",
      minimum: 0,
    },
    {
      id: "strongerEvidence",
      kind: "stringList",
      label: "Stronger evidence labels",
    },
  ],
  title: "Evidence Hierarchy External Confirmation Ranking Table",
});

export const runEvidenceHierarchy = evidenceHierarchyTool.execute;
export default evidenceHierarchyTool;
